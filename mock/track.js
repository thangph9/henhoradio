export default {
  'GET /api/track/get/:track_id': (req, res) => {
    const track = {
      title: 'Hen ho raio',
      date: new Date(),
      mc: 'ABC',
      description: 'Noi dung',
      youtube: false,
      track_id: req.params.track_id,
      audio: 'audioid',
      icon: 'icon',
      local: 'HN',
      status: '1',
    };
    res.send({ status: 'ok', data: track });
  },
  'GET /api/track/list': (req, res) => {
    const track = [
      {
        title: 'Hen ho raio',
        date: new Date(),
        mc: 'ABC',
        description: 'Noi dung',
        youtube: false,
        track_id: 'ABC',
        audio: 'audioid',
        icon: 'icon',
        local: 'HN',
        status: '1',
      },
    ];
    res.send({ status: 'ok', data: track });
  },
  'GET /api/track/fetch': (req, res) => {
    const track = [
      {
        title: 'Hen ho raio',
        date: new Date(),
        mc: 'ABC',
        description: 'Noi dung',
        youtube: false,
        track_id: 'ABC',
        audio: 'audioid',
        audioRecord: 1,
        icon: 'icon',
        location: 'HN',
        status: '1',
      },
    ];
    const pagination = {};
    res.send({ status: 'ok', data: { list: track, pagination } });
  },
  'POST /api/track/form/add': (req, res) => {
    const track = [
      {
        title: 'Hen ho raio',
        date: new Date(),
        mc: 'ABC',
        description: 'Noi dung',
        youtube: false,
        track_id: 'ABC',
        audio: 'audioid',
        icon: 'icon',
        local: 'HN',
        status: '1',
      },
    ];
    console.log(track);
    res.send({ status: 'ok', data: req.body });
  },
  'PUT /api/track/form/edit': (req, res) => {
    res.send({ status: 'ok', data: req.body });
  },
  'DELETE /api/track/del/:track_id': (req, res) => {
    res.send({ status: 'ok', data: req.params });
  },
};
