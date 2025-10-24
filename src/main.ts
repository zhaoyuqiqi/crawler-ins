import pLimit from "p-limit";
import { InskeepCrawler } from "./ins/inskeep";
import { categoryMap } from "./constants";

async function crawlerInsShow() {
  const ic = new InskeepCrawler();
  try {
    await ic.init();
    const limit = pLimit(3);
    const ranks = await ic.getRankList();
    if (!ranks) {
      console.log("获取榜单失败");
      return;
    }
    const groups = ranks.map((rank) => rank.id);
    for (const groupId of groups) {
      let data = await ic.fetchUserRank(groupId);
      if (!data) {
        console.log("获取用户失败");
        continue;
      }
      while (data && data.list.length !== 0) {
        console.log(`当前抓取的分类为:${groupId}，转换为inshow的id为${categoryMap.get(groupId) || 0}`);
        const tasks = data.list.map((user) =>
          limit(() =>
            ic.run({
              starId: user.user_id,
              fullName: user.full_name,
              userName: user.username,
              categoryId: categoryMap.get(groupId) || 0,
            })
          )
        );
        await Promise.all(tasks);
        data = await ic.fetchUserRank(groupId, data.offset);
      }
    }
    console.log("排行榜帖子抓取完毕");
    const stars = await ic.getStarWithCategoryId();
    console.log("抓取没有分类的帖子");
    const withoutCategoryIdTasks = stars.map((star) =>
      limit(() =>
        ic.run({
          starId: star.insStarId,
        })
      )
    );
    await Promise.all(withoutCategoryIdTasks);
    console.log("没有分类帖子抓取完毕");
  } catch (error) {
    console.log("抓取出错", error);
  } finally {
    await ic.dispose();
  }
}

async function main() {
  await crawlerInsShow();
}

main();
