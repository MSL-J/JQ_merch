import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";

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
    // STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by closing the window
    this.externalWindow.close();
  }

  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

export default withRouter(Popup);
