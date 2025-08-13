#!/usr/bin/env node

/**
 * 版本管理和发布脚本
 *
 * 功能：
 * 1. 自动升级版本号（支持选择升级x.y.z三个版本，默认自增z版本号）
 * 2. 自动打tag并push tag
 * 3. 自动解析tag之间的提交代码，生成版本更新记录
 */

const fs = require("fs").promises;
const path = require("path");
const { execSync, spawnSync } = require("child_process");
const readline = require("readline");

// 项目根目录路径
const ROOT_DIR = path.resolve(__dirname, "..");
// package.json 文件路径
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json");
// 版本更新记录文件路径
const CHANGELOG_PATH = path.join(ROOT_DIR, "CHANGELOG.md");

// 提交类型映射，用于生成更新日志
const COMMIT_TYPES = {
    feat: "✨ 新功能",
    fix: "🐛 Bug修复",
    docs: "📚 文档",
    style: "💎 代码风格",
    refactor: "♻️ 重构",
    perf: "⚡ 性能优化",
    test: "✅ 测试",
    build: "📦 构建",
    ci: "👷 CI配置",
    chore: "🔧 其他更改",
    revert: "⏪ 回滚",
};

// 创建readline接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * 提问函数
 * @param {string} question 问题
 * @returns {Promise<string>} 用户输入
 */
function ask(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

/**
 * 读取package.json文件
 * @returns {Promise<Object>} package.json内容
 */
async function readPackageJson() {
    try {
        const data = await fs.readFile(PACKAGE_JSON_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("读取package.json失败:", error.message);
        process.exit(1);
    }
}

/**
 * 写入package.json文件
 * @param {Object} packageJson package.json内容
 * @returns {Promise<void>}
 */
async function writePackageJson(packageJson) {
    try {
        await fs.writeFile(
            PACKAGE_JSON_PATH,
            JSON.stringify(packageJson, null, 2) + "\n",
            "utf8"
        );
    } catch (error) {
        console.error("写入package.json失败:", error.message);
        process.exit(1);
    }
}

/**
 * 升级版本号
 * @param {string} currentVersion 当前版本号
 * @param {string} type 升级类型 ('major', 'minor', 'patch')
 * @returns {string} 新版本号
 */
function upgradeVersion(currentVersion, type) {
    const [major, minor, patch] = currentVersion.split(".").map(Number);

    switch (type) {
        case "major":
            return `${major + 1}.0.0`;
        case "minor":
            return `${major}.${minor + 1}.0`;
        case "patch":
        default:
            return `${major}.${minor}.${patch + 1}`;
    }
}

/**
 * 检查git仓库状态
 * @returns {boolean} 是否有未提交的更改
 */
function checkGitStatus() {
    try {
        const status = execSync("git status --porcelain", { encoding: "utf8" });
        return status.trim() !== "";
    } catch (error) {
        console.error("检查git状态失败:", error.message);
        return true; // 假设有未提交的更改
    }
}

/**
 * 获取最新的tag
 * @returns {string|null} 最新的tag或null
 */
function getLatestTag() {
    try {
        const tags = execSync("git tag --sort=-v:refname", {
            encoding: "utf8",
        }).trim();
        if (!tags) return null;
        return tags.split("\n")[0];
    } catch (error) {
        console.error("获取最新tag失败:", error.message);
        return null;
    }
}

/**
 * 创建git tag
 * @param {string} version 版本号
 * @returns {boolean} 是否成功
 */
function createGitTag(version) {
    try {
        execSync(`git tag v${version}`, { encoding: "utf8" });
        return true;
    } catch (error) {
        console.error("创建git tag失败:", error.message);
        return false;
    }
}

/**
 * 推送git tag
 * @param {string} version 版本号
 * @returns {boolean} 是否成功
 */
function pushGitTag(version) {
    try {
        execSync(`git push origin v${version}`, { encoding: "utf8" });
        return true;
    } catch (error) {
        console.error("推送git tag失败:", error.message);
        return false;
    }
}

/**
 * 解析提交记录
 * @param {string} fromTag 起始tag
 * @returns {Object} 分类后的提交记录
 */
function parseCommits(fromTag) {
    try {
        let gitLogCommand = 'git log --pretty=format:"%h %s" --no-merges';
        if (fromTag) {
            gitLogCommand += ` ${fromTag}..HEAD`;
        }

        const commits = execSync(gitLogCommand, { encoding: "utf8" }).trim();
        if (!commits) return {};

        const commitsByType = {};

        commits.split("\n").forEach((commit) => {
            const [hash, ...messageParts] = commit.split(" ");
            const message = messageParts.join(" ");

            // 尝试匹配常见的提交格式，如 "feat: 添加新功能"
            const typeMatch = message.match(/^(\w+)(?:\(([^)]+)\))?:\s(.+)$/);

            if (typeMatch) {
                const [, type, scope, description] = typeMatch;
                const displayType = COMMIT_TYPES[type] || type;

                if (!commitsByType[displayType]) {
                    commitsByType[displayType] = [];
                }

                const scopeText = scope ? `(${scope}) ` : "";
                commitsByType[displayType].push({
                    hash,
                    message: `${scopeText}${description}`,
                });
            } else {
                // 对于不符合格式的提交，归类到"其他更改"
                if (!commitsByType[COMMIT_TYPES.chore]) {
                    commitsByType[COMMIT_TYPES.chore] = [];
                }
                commitsByType[COMMIT_TYPES.chore].push({
                    hash,
                    message,
                });
            }
        });

        return commitsByType;
    } catch (error) {
        console.error("解析提交记录失败:", error.message);
        return {};
    }
}

/**
 * 生成更新日志内容
 * @param {string} version 版本号
 * @param {Object} commitsByType 分类后的提交记录
 * @returns {string} 更新日志内容
 */
function generateChangelogContent(version, commitsByType) {
    const date = new Date().toISOString().split("T")[0];
    let content = `## [v${version}] - ${date}\n\n`;

    Object.keys(commitsByType).forEach((type) => {
        const commits = commitsByType[type];
        if (commits.length > 0) {
            content += `### ${type}\n\n`;

            commits.forEach((commit) => {
                content += `- ${commit.message} (${commit.hash})\n`;
            });

            content += "\n";
        }
    });

    return content;
}

/**
 * 更新CHANGELOG.md文件
 * @param {string} newContent 新内容
 * @returns {Promise<boolean>} 是否成功
 */
async function updateChangelog(newContent) {
    try {
        let existingContent = "";

        try {
            existingContent = await fs.readFile(CHANGELOG_PATH, "utf8");
        } catch (error) {
            // 如果文件不存在，创建一个新的
            existingContent = "# 更新日志\n\n";
        }

        // 在标题后插入新内容
        const updatedContent = existingContent.replace(
            "# 更新日志\n\n",
            `# 更新日志\n\n${newContent}`
        );

        await fs.writeFile(CHANGELOG_PATH, updatedContent, "utf8");
        return true;
    } catch (error) {
        console.error("更新CHANGELOG.md失败:", error.message);
        return false;
    }
}

/**
 * 主函数
 */
async function main() {
    try {
        console.log("🚀 开始版本管理和发布流程...\n");

        // 检查git状态
        if (checkGitStatus()) {
            console.log("⚠️  检测到有未提交的更改。请先提交或暂存您的更改。");
            const proceed = await ask("是否仍要继续? (y/n): ");
            if (proceed.toLowerCase() === "n") {
                console.log("❌ 操作已取消");
                process.exit(0);
            }
        }

        // 读取当前版本号
        const packageJson = await readPackageJson();
        const currentVersion = packageJson.version;
        console.log(`📦 当前版本: v${currentVersion}\n`);

        // 选择要升级的版本部分
        console.log("请选择要升级的版本部分:");
        console.log("1) 主版本 (x.0.0)");
        console.log("2) 次版本 (0.y.0)");
        console.log("3) 补丁版本 (0.0.z) [默认]");

        const choice = await ask("请输入选项 (1-3): ");

        let versionType;
        switch (choice) {
            case "1":
                versionType = "major";
                break;
            case "2":
                versionType = "minor";
                break;
            case "3":
            default:
                versionType = "patch";
                break;
        }

        // 计算新版本号
        const newVersion = upgradeVersion(currentVersion, versionType);
        console.log(`\n📈 新版本将是: v${newVersion}`);

        // 确认升级
        const confirmUpgrade = await ask("确认升级版本? (Y/n): ");
        if (confirmUpgrade.toLowerCase() === "n") {
            console.log("❌ 版本升级已取消");
            process.exit(0);
        }

        // 更新package.json
        packageJson.version = newVersion;
        await writePackageJson(packageJson);
        console.log("✅ package.json 已更新");

        // 获取最新的tag
        const latestTag = getLatestTag();
        console.log(`🏷️  最新tag: ${latestTag || "无"}`);

        // 解析提交记录
        console.log("\n📝 正在解析提交记录...");
        const commitsByType = parseCommits(latestTag);

        // 生成更新日志
        const changelogContent = generateChangelogContent(
            newVersion,
            commitsByType
        );
        console.log("\n📋 更新日志预览:\n");
        console.log(changelogContent);

        // 确认更新日志
        const confirmChangelog = await ask("确认更新日志内容? (Y/n): ");
        if (confirmChangelog.toLowerCase() === "n") {
            console.log("❌ 更新日志生成已取消");
            process.exit(0);
        }

        // 更新CHANGELOG.md
        await updateChangelog(changelogContent);
        console.log("✅ CHANGELOG.md 已更新");

        // 自动提交package.json和CHANGELOG.md
        try {
            execSync("git add package.json CHANGELOG.md", { stdio: "inherit" });
            execSync(`git commit -m "chore(release): v${newVersion}"`, {
                stdio: "inherit",
            });
            console.log(
                `✅ 已自动提交版本文件，commit: chore(release): v${newVersion}`
            );
        } catch (error) {
            console.error("自动提交失败，请手动处理。", error.message);
            process.exit(1);
        }

        // 确认创建tag
        const confirmTag = await ask(
            `是否创建并推送tag v${newVersion}? (Y/n): `
        );
        try {
            const branchName = execSync("git rev-parse --abbrev-ref HEAD", {
                encoding: "utf8",
            }).trim();
            execSync(`git push origin ${branchName}`, { stdio: "inherit" });
            console.log(`✅ 当前分支 ${branchName} 已推送到远程仓库`);
        } catch (error) {
            console.error("自动推送分支失败，请手动处理。", error.message);
        }

        // 创建并推送tag
        if (createGitTag(newVersion)) {
            console.log(`✅ Tag v${newVersion} 已创建`);

            if (pushGitTag(newVersion)) {
                console.log(`✅ Tag v${newVersion} 已推送到远程仓库`);
            }
        }

        console.log("\n🎉 版本管理和发布流程已完成!");
        console.log(`📦 新版本: v${newVersion}`);
    } catch (error) {
        console.error("发生错误:", error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// 执行主函数
main();
