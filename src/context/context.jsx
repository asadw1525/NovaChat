// import { createContext, useState } from "react";
// import main from "../config/gemini";

// export const Context = createContext();

// const ContextProvider = (props) => {

//     const [input,setInput] = useState("");
//     const [recentPrompt,setRecentPrompt] = useState("");
//     const [prevPrompt,setPrevPrompts] = useState([]);
//     const [showResult,setShowResult] = useState(false);
//     const [loading,setLoading] = useState(false);
//     const [resultData,setResultData] = useState("");

//     const delayPara = (index,nextWord) => {
//         setTimeout(function (){
//             setResultData(prev => prev+nextWord)
//         },75*index)
//     }

//     const newChat = () => {
//         setLoading(false)
//         setShowResult(false)
//     }

//   const onSent = async (prompt) => {
//   setResultData("");
//   setLoading(true);
//   setShowResult(true);

//   let response;
//   if (prompt !== undefined) {
//     response = await main(prompt); // ✅ fixed
//     setRecentPrompt(prompt);
//   } else {
//     setPrevPrompts(prev => [...prev, input]);
//     setRecentPrompt(input);
//     response = await main(input);
//   }

//   let responseArray = response.split("**");
//   let newResponse = "";

//   for (let i = 0; i < responseArray.length; i++) {
//     if (i === 0 || i % 2 !== 1) {
//       newResponse += responseArray[i];
//     } else {
//       newResponse += "<b>" + responseArray[i] + "</b>";
//     }
//   }

//   let newResponse2 = newResponse.split("*").join("<br>");
//   let newResponseArray = newResponse2.split(" ");
//   for (let i = 0; i < newResponseArray.length; i++) {
//     const nextWord = newResponseArray[i];
//     delayPara(i, nextWord + " ");
//   }

//   setLoading(false);
//   setInput("");
// };


//     const ContextValue = {
//         prevPrompt,
//         setPrevPrompts,
//         onSent,
//         setRecentPrompt,
//         recentPrompt,
//         showResult,
//         loading,
//         resultData,
//         input,
//         setInput,
//         newChat
//     }

//     return(
//         <Context.Provider value={ContextValue}>
//             {props.children}
//         </Context.Provider>
//     )
// }

// export default ContextProvider
import { createContext, useState ,useEffect} from "react";
import main from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState(() => {
      return localStorage.getItem("recentPrompt") || "";
    });
    // const [prevPrompt,setPrevPrompts] = useState([]);
    const [prevPrompt,setPrevPrompts] = useState(() => {
      const saved = localStorage.getItem("prevPrompt");
      return saved ? JSON.parse(saved) : [];
    });

    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    useEffect(() => {
    localStorage.setItem("prevPrompt", JSON.stringify(prevPrompt));
  }, [prevPrompt]);

  // Save to localStorage when recentPrompt changes
  useEffect(() => {
    localStorage.setItem("recentPrompt", recentPrompt);
  }, [recentPrompt]);


    const delayPara = (index,nextWord) => {
        setTimeout(function (){
            setResultData(prev => prev+nextWord)
        },75*index)
    }

    // const newChat = () => {
    //     setLoading(false)
    //     setShowResult(false)
    // }
    const newChat = () => {
  setLoading(false);
  setShowResult(false);
  setPrevPrompts([]);
  setRecentPrompt("");
  localStorage.removeItem("prevPrompt");
  localStorage.removeItem("recentPrompt");
};


  const onSent = async (prompt) => {
  setResultData("");
  setLoading(true);
  setShowResult(true);

  let response;
  if (prompt !== undefined) {
    response = await main(prompt); // ✅ fixed
    setRecentPrompt(prompt);
  } else {
    setPrevPrompts(prev => [...prev, input]);
    setRecentPrompt(input);
    response = await main(input);
  }

  let responseArray = response.split("**");
  let newResponse = "";

  for (let i = 0; i < responseArray.length; i++) {
    if (i === 0 || i % 2 !== 1) {
      newResponse += responseArray[i];
    } else {
      newResponse += "<b>" + responseArray[i] + "</b>";
    }
  }

  let newResponse2 = newResponse.split("*").join("<br>");
  let newResponseArray = newResponse2.split(" ");
  for (let i = 0; i < newResponseArray.length; i++) {
    const nextWord = newResponseArray[i];
    delayPara(i, nextWord + " ");
  }

  setLoading(false);
  setInput("");
};


    const ContextValue = {
        prevPrompt,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return(
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
