exports.mockMeetingList = [
  {
    _id: "621d02dc40cb39e0db59b3b9",
    title: "판교역 저녁식사 대작전.",
    tag: ["저녁식사", "직장인"],
    description:
      "안녕하세요 저는 판교 직장인입니다. 제가 판교에 온지 얼마 되지 않아 어디서 저녁식사를 하면 가장 좋을지 생각이 안나요. 판교에서 저와 같이 최고의 맛집을 찾아 떠나실 미식가 분들을 찾습니다.",
    owner: "621c5447d20d6d0d905e4f39",
    reservation: [],
    colleague: [],
    recruitmentNumber: 6,
    startTime: "2023-03-28T17:20:19",
    chatList: [],
    isLive: false,
    isEnd: false,
    ownerSocketId: null,
  },
  {
    _id: "621d0dbc40cb39e0db59b3bb",
    title: "알고리즘.",
    tag: ["개발자", "취준생"],
    description:
      "개발자 취준생입니다. 알고리즘이 너무 어려워서 어떻게 공부할지 감이 안잡히네요... 좋은 아이디어 추천 받습니다. 그리고 같이 공부하실분도 찾습니다....",
    owner: "621c5447d20d6d0d905e4f39",
    reservation: [],
    colleague: ["6222cafc39eaaa1fa52c5d8c"],
    recruitmentNumber: 6,
    startTime: "2022-03-01T17:20:19",
    chatList: [
      {
        username: "tester1",
        text: "sdf",
        date: "2022-03-04T15:16:52.803Z",
        _id: "62222d64335c124134308490",
      },
      {
        username: "tester1",
        text: "xptm",
        date: "2022-03-04T15:24:12.657Z",
        _id: "62222f1c335c1241343084c0",
      },
      {
        username: "Stranger",
        text: "asd",
        date: "2022-03-04T15:40:48.019Z",
        _id: "62223300335c124134308691",
      },
      {
        username: "Stranger",
        text: "dfsdf",
        date: "2022-03-04T15:40:49.197Z",
        _id: "62223301335c12413430869a",
      },
      {
        username: "Stranger",
        text: "asd",
        date: "2022-03-04T15:40:49.805Z",
        _id: "62223301335c1241343086a4",
      },
    ],
    isLive: false,
    isEnd: true,
    ownerSocketId: null,
  },
];

exports.mockUserList = [
  {
    _id: "621c5447d20d6d0d905e4f39",
    username: "tester1",
    email: "tester1@gmail.com",
    profilePicture:
      "https://lh3.googleusercontent.com/a-/AOh14Gi2paMbKoqVzfz8lQm6Kuz9zPSsJwINAMVDdfaAdA=s96-c",
    __v: 0,
    currentSocket: null,
    currentSocketId: "SF8L9yCrXam5_N1FAAAR",
  },
  {
    _id: "6222cafc39eaaa1fa52c5d8c",
    username: "tester2",
    email: "tester2@gmail.com",
    profilePicture:
      "https://lh3.googleusercontent.com/a/AATXAJxX0PZqgHakWDjIeRSL92QW90KVAiOZ1t-ZSlXw=s96-c",
    __v: 0,
    currentSocketId: null,
  },
];
