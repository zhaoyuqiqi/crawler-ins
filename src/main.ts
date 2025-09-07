import pLimit from 'p-limit';
import { InshowCrawler } from './ins/inshow';

async function crawlerInsShow() {
  const ic = new InshowCrawler();
  try {
    await ic.init();
    const limit = pLimit(1);
    const ranks = await ic.getRankList();
    if (!ranks) {
      console.log('获取榜单失败');
      return;
    }
    const groups = ranks.map(rank => rank.id);
    for (const groupId of groups) {
      const users = await ic.fetchUserRank(groupId);
      if (!users) {
        console.log('获取用户失败');
        continue;
      }
      const tasks = users.map(user =>
        limit(() =>
          ic.run({
            starId: user.page_id,
            categoryId: groupId
          })
        )
      );
      await Promise.all(tasks);
    }
    console.log('排行榜帖子抓取完毕');
    const stars = await ic.getStarWithCategoryId();
    console.log('抓取没有分类的帖子');
    const withoutCategoryIdTasks = stars.map(star =>
      limit(() =>
        ic.run({
          starId: star.insStarId
        })
      )
    );
    await Promise.all(withoutCategoryIdTasks);
    console.log('没有分类帖子抓取完毕');
  } catch (error) {
    console.log('抓取出错', error);
  } finally {
    const failTokens = ic.jwtManage.tokens.filter(t => t.failures > 0);
    console.log('失效的Token：', failTokens);
    await ic.dispose();
  }
}

async function main() {
  await crawlerInsShow();
}

main();
