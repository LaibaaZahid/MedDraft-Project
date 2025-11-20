"use client";

import { useState } from "react";
import Landing from "./components/Landing";
import MainApp from "./components/MainApp";

export default function Home() {
  const [showMain, setShowMain] = useState(false);

  return showMain 
    ? <MainApp goHome={() => setShowMain(false)} /> 
    : <Landing onTry={() => setShowMain(true)} />;
}
