import type { Request, Response } from 'express';
import Mock from 'mockjs';
import type { UserInfoType } from './type';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: UserInfoType[] = [];
  const random = Mock.Random;
  for (let i = 0; i < pageSize; i += 1) {
    tableListDataSource.push({
      identity: String(random.integer(6)),
      name: random.cname(),
      housenumber: '1-101',
      academy: '计算机学院',
      phone: random.integer(13400000000, 13500000000),
      status: random.integer(0, 2),
      checkinTime: random.date(),
      checkoutTime: random.date(),
      campus: '大学城校区',
    });
  }
  console.log('shm 123', tableListDataSource);
  // tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  // if (params.sorter) {
  //   const sorter = JSON.parse(params.sorter as any);
  //   dataSource = dataSource.sort((prev, next) => {
  //     let sortNumber = 0;
  //     Object.keys(sorter).forEach((key) => {
  //       if (sorter[key] === 'descend') {
  //         if (prev[key] - next[key] > 0) {
  //           sortNumber += -1;
  //         } else {
  //           sortNumber += 1;
  //         }
  //         return;
  //       }
  //       if (prev[key] - next[key] > 0) {
  //         sortNumber += 1;
  //       } else {
  //         sortNumber += -1;
  //       }
  //     });
  //     return sortNumber;
  //   });
  // }
  // if (params.filter) {
  //   const filter = JSON.parse(params.filter as any) as Record<string, string[]>;
  //   if (Object.keys(filter).length > 0) {
  //     dataSource = dataSource.filter((item) => {
  //       return Object.keys(filter).some((key) => {
  //         if (!filter[key]) {
  //           return true;
  //         }
  //         if (filter[key].includes(`${item[key]}`)) {
  //           return true;
  //         }
  //         return false;
  //       });
  //     });
  //   }
  // }

  // if (params.name) {
  //   dataSource = dataSource.filter((data) => data.name.includes(params.name || ''));
  // }

  // let finalPageSize = 10;
  // if (params.pageSize) {
  //   finalPageSize = parseInt(`${params.pageSize}`, 10);
  // }

  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize: 20,
    current: 1,
  };
  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { name, desc, key } = body;

  switch (req.method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      tableListDataSource = tableListDataSource.filter((item) => key.indexOf(item.key) === -1);
      break;
    case 'POST':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule = {
          key: tableListDataSource.length,
          href: 'https://ant.design',
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
          name,
          owner: '曲丽丽',
          desc,
          callNo: Math.floor(Math.random() * 1000),
          status: (Math.floor(Math.random() * 10) % 2).toString(),
          updatedAt: new Date(),
          createdAt: new Date(),
          progress: Math.ceil(Math.random() * 100),
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;

    case 'PUT':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.key === key) {
            newRule = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

export default {
  'GET /api/user/fetchInfo': getRule,
  'POST /api/user/addInfo': postRule,
  'DELETE /api/user/addInfo': postRule,
  'PUT /api/user/deleteInfo': postRule,
};
