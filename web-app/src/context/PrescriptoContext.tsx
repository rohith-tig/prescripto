import React from "react";

interface USERINFO {
  userName: string;
  userEmail: string;
  age: number | null;
}

interface PrescriptoContext {
  userInfoFunc: (item: USERINFO) => void;
  userInfoList: USERINFO[];
}

const prescriptoContext = React.createContext<PrescriptoContext>({
  userInfoFunc: () => {},
  userInfoList: [],
});

export default prescriptoContext;
