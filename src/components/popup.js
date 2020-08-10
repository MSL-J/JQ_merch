import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

class Popup extends React.Component {
  constructor(props) {
    super(props);
    // STEP 1: create a container <div>
    this.containerEl = document.createElement("div");
    this.externalWindow = null;
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    this.externalWindow = window.open(
      "",
      "",
      "width=600,height=400,left=200,top=200"
    );

    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    this.externalWindow.document.body.appendChild(this.containerEl);
    this.externalWindow.document.title = this.props.name;

    // Applying(appending) styles to all new windows
    function copyStyles(sourceDoc, targetDoc) {
      Array.from(
        sourceDoc.querySelectorAll('link[rel="stylesheet"], style')
      ).forEach((link) => {
        targetDoc.head.appendChild(link.cloneNode(true));
      });
    }
    copyStyles(document, this.externalWindow.document);

    // update the state in the parent component if the user closes the new window
    this.externalWindow.addEventListener("beforeunload", () => {
      this.props.closed();
    });
  }

  componentWillUnmount() {
    // console.log(this.props.children.props.children);

    // STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by closing the window
    // this.props.closed();
    this.externalWindow.close();
  }

  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

// class App extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       counter: 0,
//       showWindowPortal: false,
//     };

//     this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
//   }

//   componentDidMount() {
//     window.addEventListener("beforeunload", () => {
//       this.closeWindowPortal();
//     });

//     window.setInterval(() => {
//       this.setState((state) => ({
//         counter: state.counter + 1,
//       }));
//     }, 1000);
//   }

//   toggleWindowPortal() {
//     this.setState((state) => ({
//       ...state,
//       showWindowPortal: !state.showWindowPortal,
//     }));
//   }

//   closeWindowPortal = () => {
//     this.setState({ showWindowPortal: false });
//   };

//   render() {
//     return (
//       <AsideTitle>
//         <div>
//           (수정) 상품명 :
//           <button onClick={this.toggleWindowPortal}>상품명 추천</button>
//         </div>
//         {this.state.showWindowPortal && (
//           <Popup closed={this.closeWindowPortal} name="상품명 추천">
//             <PopupWrapper>
//               <PopupTitle>검색단어</PopupTitle>
//               <InputField>
//                 <input></input>
//                 <button>검색</button>
//               </InputField>
//               <Related>
//                 <Row>
//                   <div>쇼핑연관</div>
//                   <div></div>
//                 </Row>
//                 <Row>
//                   <div>키워드 추천</div>
//                   <div></div>
//                 </Row>
//               </Related>
//               <PopupTitle>제목입력</PopupTitle>
//               <InputField>
//                 <input
//                   // placeholder={ogName}
//                   onChange={() => console.log("heeeeee")}
//                 ></input>
//                 <button>입력</button>
//               </InputField>
//               <ButtonContainer>
//                 <button onClick={() => this.closeWindowPortal()}>닫기</button>
//               </ButtonContainer>
//             </PopupWrapper>
//           </Popup>
//         )}

//         <ol>
//           {Array(5)
//             .fill()
//             .map(() => {
//               return <li></li>;
//             })}
//         </ol>
//       </AsideTitle>
//     );
//   }
// }

export default withRouter(Popup);

// const AsideTitle = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 15px 0;
//   border-bottom: 1px dashed gray;
//   font-size: 15px;
//   font-weight: 600;

//   div:first-of-type {
//     display: flex;
//     flex-direction: column;
//     width: 40%;
//     button {
//       width: 70%;
//       min-height: 30px;
//       margin-top: 10px;
//     }
//   }
//   div:nth-of-type(2) {
//     display: flex;
//     max-width: 250px;
//   }
//   span {
//     font-size: 12px;
//     font-weight: normal;
//     margin-left: 1vw;
//   }
//   input {
//     margin-left: 1vw;
//   }
//   textarea {
//     margin-left: 1vw;
//     height: 80px;
//     min-width: 180px;
//   }
//   ol {
//     padding-left: 32px;
//   }
// `;
// const PopupWrapper = styled.div`
//   height: 100%;
//   background-color: white;
// `;

// const PopupTitle = styled.div`
//   display: flex;
//   justify-content: center;
//   background-color: snow;
//   border-bottom: 1px solid black;
//   font-weight: bold;
// `;

// const InputField = styled.div`
//   display: flex;
//   justify-content: space-evenly;
//   padding: 15px 0;
//   border-bottom: 1px solid black;
//   input {
//     width: 70%;
//     padding-left: 5px;
//   }
//   button {
//     border: 1px solid black;
//     border-radius: 5px;
//   }
// `;

// const Related = styled.div`
//   padding: 20px 0;
//   border-bottom: 1px solid black;
// `;

// const Row = styled.div`
//   display: flex;
//   border-bottom: 0.5px solid black;
//   font-size: 12px;
//   font-weight: bold;
//   &:first-of-type {
//     border-top: 0.5px solid black;
//   }
//   div {
//     padding: 7px;
//     &:first-of-type {
//       width: 100px;
//       border-right: 0.5px solid black;
//       text-align: center;
//       background-color: snow;
//     }
//     &:last-of-type {
//       text-align: left;
//     }
//   }
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 30px;
//   button {
//     border: 1px solid black;
//     border-radius: 5px;
//     background-color: snow;
//     width: 100px;
//   }
// `;

// class App extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       counter: 0,
//       showWindowPortal: false,
//     };

//     this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
//     this.closeWindowPortal = this.closeWindowPortal.bind(this);
//   }

//   componentDidMount() {
//     window.addEventListener("beforeunload", () => {
//       this.closeWindowPortal();
//     });

//     window.setInterval(() => {
//       this.setState((state) => ({
//         counter: state.counter + 1,
//       }));
//     }, 1000);
//   }

//   toggleWindowPortal() {
//     this.setState((state) => ({
//       ...state,
//       showWindowPortal: !state.showWindowPortal,
//     }));
//   }

//   closeWindowPortal() {
//     this.setState({ showWindowPortal: false });
//   }

//   render() {
//     return (
//       <div>
//         {/* <h1>Counter: {this.state.counter}</h1> */}

//         <button onClick={this.toggleWindowPortal}>
//           {this.state.showWindowPortal ? "Close the" : "Open a"} Portal
//         </button>

//         {this.state.showWindowPortal && (
//           <Popup closed={this.closeWindowPortal}>
//             <h1>Counter in a portal: {this.state.counter}</h1>
//             <p>Even though I render in a different window, I share state!</p>

//             <button onClick={() => this.closeWindowPortal()}>Close me!</button>
//           </Popup>
//         )}
//       </div>
//     );
//   }
// }
