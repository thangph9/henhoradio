function addQuestion(req, res) {
  const params = req.body;
  params.question_id = 'D';
  params.group_id = params.group_id;
  params.title = params.title;
  params.type = params.options;
  params.answer = params.listAnswer || [];
  return res.json({ status: 'ok', data: params });
}

export default {
  'POST /api/question/form/save': addQuestion,
  'GET /api/question/fetch': (req, res) => {
    res.send({
      status: 'ok',
      data: {
        list: [
          {
            question_id: 'A',
            title: 'Cau hoi A',
            type: '1',
            group_id: 'c',
            group: 'Group 3',
            answer: null,
          },
          {
            question_id: 'B',
            title: 'Cau hoi B',
            type: '2',
            group_id: 'a',
            group: 'Group 1',
            answer: ['Dap An A', 'Dap An B', 'Dap An C'],
          },
          {
            question_id: 'C',
            title: 'Cau hoi C',
            type: '3',
            group_id: 'b',
            group: 'Group 2',
            answer: ['Dap An A', 'Dap An B', 'Dap An C'],
          },
        ],
        pagination: {},
      },
    });
  },
  'DELETE /api/question/remove/:question_id': (req, res) => {
    res.send({ status: 'ok', data: req.params });
  },
};
