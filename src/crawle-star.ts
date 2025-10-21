import axios from 'axios';
import { retry } from 'retry-anything';
import { InskeepCrawler } from './ins/inskeep';

async function notifyNode(starId: string, token: string, status: number) {
  await retry({
    interval: 2000,
    async adapter() {
      try {
        const data = await axios.post('https://instar.19981105.xyz/webhook/api/action-complete', {
          starId,
          token,
          status,
        });
        return data.data.code === 0;
      } catch (error) {
        return false;
      }
    },
  }).catch(() => {
    console.log('超出最大执行次数失败');
  });
}

async function main() {
  const starId = process.env.STAR_ID;
  const userName = process.env.USER_NAME;
  const fullName = process.env.FULL_NAME;
  console.log(starId, userName, fullName);
  if (!starId) return;
  const ic = new InskeepCrawler();
  try {
    await ic.init(true);
    await ic.run({
      starId,
      userName,
      fullName,
    });
    await notifyNode(starId, 'instar', 1);
  } catch (error) {
    await notifyNode(starId, 'instar', 0);
    console.log(error);
    // noop
  } finally {
    await ic.dispose();
  }
}

main();
