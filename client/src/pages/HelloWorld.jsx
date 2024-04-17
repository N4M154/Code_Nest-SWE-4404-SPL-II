import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "./HelloWorld.css";
import { downloadPDF } from "../utils/pdf";

export default function HelloWorld() {
  const pdfRef = useRef();
  const [highlightedText, setHighlightedText] = useState("");
  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [userText, setUserText] = useState("Hello, world!");
  const [isButtonVisible, setIsButtonVisible] = useState(false); // State variable to track button visibility
  const MAX_TEXT_LENGTH = 30;

  const handleHighlight = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const rangeCount = selection.rangeCount;
    const ranges = [];

    for (let i = 0; i < rangeCount; i++) {
      const range = selection.getRangeAt(i);
      ranges.push({
        range,
        color: "yellow", // Set the default highlight color here
      });
    }

    setHighlightedRanges([...highlightedRanges, ...ranges]);
    setHighlightedText(selectedText);
    setIsButtonVisible(true); // Show the button when text is highlighted
    //selection.removeAllRanges(); // Clear the selection
  };

  const undoHighlight = () => {
    const lastHighlightedRange = highlightedRanges.pop();
    const lastHighlightedText = lastHighlightedRange.range.toString();
    const lastHighlightedColor = lastHighlightedRange.color;

    setHighlightedText(lastHighlightedText);
    setHighlightedRanges([...highlightedRanges]); // Update the highlightedRanges state without the last highlight

    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(
      lastHighlightedRange.range.startContainer,
      lastHighlightedRange.range.startOffset
    );
    range.setEnd(
      lastHighlightedRange.range.endContainer,
      lastHighlightedRange.range.endOffset
    );
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("hiliteColor", false, lastHighlightedColor); // Apply highlight color
  };

  const handleUserTextChange = (e) => {
    const newText = e.target.value.slice(0, MAX_TEXT_LENGTH);
    setUserText(newText);
  };

  const unlockNextLevel = () => {
    window.location.href = "/variables";
    // Assuming you are using fetch API to send data to the backend
    fetch("/api/unlockNextLevel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        /* Any data you want to send to the backend */
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response from the server
        console.log(data);
        // Assuming the server responds with success
        if (data.success) {
          // Navigate to variables.jsx
          window.location.href = "/variables";
        } else {
          console.error("Failed to unlock next level");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-5xl font-bold mb-8 text-sky-800">Hello, World!</h1>
      <div
        className="max-w-screen-lg mx-auto px-4"
        id="pdfContent"
        onClick={handleHighlight}
      >
        <h1 className="text-3xl font-bold mb-8 text-sky-800">Introduction</h1>

        <p>
          The "Hello, world!" program holds a special place in the realm of
          computer programming. While seemingly trivial, its significance
          extends far beyond its modest output. As one embarks on the journey of
          learning C programming, the creation of this foundational program
          marks a pivotal moment, symbolizing the initiation into a world of
          logic, syntax, and problem-solving.
        </p>
        <p>
          With anticipation and trepidation, the novice programmer opens their
          preferred text editor and begins to transcribe the cryptic symbols
          that constitute the C programming language. With each keystroke, the
          compiler awaits, ready to transform the abstract constructs into
          executable instructions.
        </p>
        <p>
          The lines of code take shape, guided by the principles of structure
          and syntax. With precision, the programmer assembles the components of
          the program, encapsulating the essence of the task at hand. At the
          heart of it all lies the fundamental directive:
        </p>

        <div className="bg-gray-300 p-4 rounded-md mt-8">
          <pre className="text-gray-700">
            <code>
              {`
#include <stdio.h>

int main() {
    printf("${userText}\\n"); // Updated to use userText variable
    return 0;
}
            `}
            </code>
          </pre>
        </div>

        <p className="mt-8">The output comes out to:</p>

        <div className="bg-gray-300 p-4 rounded-md">
          <p className="text-gray-700 font-medium">{userText}</p>
        </div>
        <p className="mt-4 text-center font-semibold font-sans text-blue-900">
          You can customize your own message!
        </p>
      </div>

      <div className="mt-4 ">
        <label htmlFor="userText" className="mr-2 ">
          Customize Message:
        </label>
        <input
          className="bg-gray-500 text-white rounded-lg p-4"
          type="text"
          id="userText"
          value={userText}
          onChange={handleUserTextChange}
        />
        {userText.length >= MAX_TEXT_LENGTH && (
          <label className="text-red-500 ml-2">
            Cannot exceed {MAX_TEXT_LENGTH} characters
          </label>
        )}
      </div>

      <div className="mt-4">
        <button
          className="bg-sky-800 text-white px-4 py-2 rounded-md"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
        {isButtonVisible && ( // Render the button only when text is highlighted
          <button
            className="bg-sky-800 text-white px-4 py-2 ml-2 rounded-md"
            onClick={undoHighlight}
          >
            Check Last Highlight and remove
          </button>
        )}
      </div>

      <p className="mt-4">Highlighted Text: {highlightedText}</p>

      {/* Unlock Next Level button */}
      <div className="mt-4">
        <Link
          to="/variables"
          className="btn bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Go to the Next Level
        </Link>
      </div>
    </div>
  );
}