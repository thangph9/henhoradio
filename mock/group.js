export default {
  'POST /api/group/form/save': (req, res) => {
    const params = req.body;
    const data = params;
    if (params.action === 'add') {
      data.group_id = 'f';
    }
    res.send({ status: 'ok', data });
  },
  'GET /api/group/fetch': (req, res) => {
    const data = {
      list: [
        { group_id: 'a', title: 'Group 1' },
        { group_id: 'b', title: 'Group 2' },
        { group_id: 'c', title: 'Group 3' },
        { group_id: 'd', title: 'Group 4' },
        { group_id: 'e', title: 'Group 5' },
      ],
      pagination: {},
    };
    res.send({ status: 'ok', data });
  },
  'DELETE /api/group/remove/:groupID': (req, res) => {
    res.send({ status: 'ok', data: req.params });
  },
};
