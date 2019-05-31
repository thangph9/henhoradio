function add(req, res) {
  res.send({ status: 'ok', data: req.body });
}
function update(req, res) {
  res.send({ status: 'ok', data: req.body });
}
const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  if (i % 2 === 0) {
    tableListDataSource.push({
      key: 'a'.concat(i),
      membersid: 'A',
      ucode: 1001,
      gcode: 100001 + i, // eslint-disable-line
      name: '01 Thang ',
      day: '01',
      month: '01',
      year: '1991',
      audio: 'Audioid',
      audioRecord: 1,
      relationshipOption: 1,
      location: 'HN',
      description: {},
      job: 'IT',
      relationship: 'SINGLE',
      createat: new Date(),
      address: 'Ha Noi',
      mobile: '0963760289',
      gender: 'MALE',
    });
  } else {
    tableListDataSource.push({
      key: 'a'.concat(i),
      membersid: 'A',
      ucode: 1001,
      gcode: 100001 + i,
      audioRecord: 2,
      relationshipOption: 2,
      name: '01 Thang ',
      day: '01',
      month: '01',
      year: 1991 + i,
      audio: 'Audioid',

      location: 'HCM',
      description: {},
      job: 'IT',
      relationship: 'SINGLEMON',
      createat: new Date(),
      address: 'Ha Noi',
      mobile: '0963760289',
      gender: 'FEMALE',
    });
  }
}

function fetch(req, res) {
  const params = req.query;
  console.log(params);

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  } else {
    dataSource = dataSource.sort((prev, next) => prev.timeup - next.timeup);
  }
  if (params.location) {
    const status = params.location.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(dataSource.filter(data => data.location === s[0]));
    });

    dataSource = filterDataSource;
  }
  if (params.audioRecord) {
    const status = params.audioRecord.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.audioRecord, 10) === parseInt(s[0], 10))
      );
    });

    dataSource = filterDataSource;
  }
  if (params.relationshipOption) {
    const status = params.relationshipOption.split(',');

    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.relationshipOption, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  if (params.unicode) {
    try {
      const code = parseInt(params.unicode, 10);
      if (code > 1000) {
        dataSource = dataSource.filter(e => e.ucode === code);
      } else {
        dataSource = dataSource.filter(e => e.gcode === code);
      }
    } catch (e) {
      console.log(e);
    }
  }
  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };
  return res.json({ status: 'ok', data: result });
}
function fetchBy(req, res) {
  res.send({ status: 'ok', data: {} });
}
function del(req, res) {
  res.send({ status: 'ok', data: res.params.membersid });
}

export default {
  'POST /api/members/form/add': add,
  'PUT /api/members/form/update': update,
  'GET /api/members/fetch': fetch,
  'GET /api/members/fetch/:membersid': fetchBy,
  'DELETE /api/members/del/:membersid': del,
};
