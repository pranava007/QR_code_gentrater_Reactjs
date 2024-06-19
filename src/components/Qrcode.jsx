import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import "./Qr.css";

function Qrcode(props) {
  let [img, setimag] = useState("");
  let [loading, setloading] = useState(false);
  let [qrdata, setqrdata] = useState("");
  let [size, setsize] = useState("");
  let [firstName, setFirstName] = useState("");
  let [description, setDescription] = useState("");
  let [audio, setAudio] = useState("");
  let [record, setRecord] = useState("");
  let [camera, setCamera] = useState("");
  let [isRecordingAudio, setIsRecordingAudio] = useState(false);
  let [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  async function gentratedQR() {
    setloading(true);

    try {
      const data = JSON.stringify({
        firstName,
        description,
        audio,
        record,
        camera,
      });
      let url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
      setimag(url);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  }

  function downloadQR() {
    fetch(img)
      .then((response) => response.blob())
      .then((blob) => {
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "qr.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  async function startRecordingAudio() {
    setIsRecordingAudio(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudio(url);
        chunks.current = [];
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error(error);
      setIsRecordingAudio(false);
    }
  }

  function stopRecordingAudio() {
    setIsRecordingAudio(false);
    mediaRecorderRef.current.stop();
  }

  async function startRecordingVideo() {
    setIsRecordingVideo(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setCamera(url);
        chunks.current = [];
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error(error);
      setIsRecordingVideo(false);
    }
  }

  function stopRecordingVideo() {
    setIsRecordingVideo(false);
    mediaRecorderRef.current.stop();
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  }

  return (
    <>
      <div className="app-container">
        <h1>QR-CODE GENERATOR</h1>
        {loading && <p>Please wait...</p>}
        {img && <img className="qr_code_img" src={img} alt="" width={size} />}
        <label htmlFor="firstNameInput" className="input-label">
          First Name:
        </label>
        <input
          type="text"
          id="firstNameInput"
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="descriptionInput" className="input-label">
          Description:
        </label>
        <input
          type="text"
          id="descriptionInput"
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="dataInput" className="input-label">
          Data for QR code:
        </label>
        <input
          type="text"
          id="dataInput"
          onChange={(e) => setqrdata(e.target.value)}
        />

        <label htmlFor="sizeInput" className="input-label">
          Image size (e.g., 150):
        </label>
        <input
          type="text"
          id="sizeInput"
          onChange={(e) => setsize(e.target.value)}
        />

        <div>
          <button className="gen" onClick={gentratedQR} disabled={loading}>
            Generate QR Code
          </button>
          <button className="don" onClick={downloadQR}>
            Download QR Code
          </button>
        </div>

        <div>
          <button
            className={isRecordingAudio ? "stop-button" : "record-button"}
            onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
          >
            {isRecordingAudio ? "Stop Audio Recording" : "Start Audio Recording"}
          </button>
        </div>

        <div>
          <button
            className={isRecordingVideo ? "stop-button" : "record-button"}
            onClick={isRecordingVideo ? stopRecordingVideo : startRecordingVideo}
          >
            {isRecordingVideo ? "Stop Video Recording" : "Start Video Recording"}
          </button>
          {isRecordingVideo && <video ref={videoRef} autoPlay />}
        </div>
      </div>
    </>
  );
}

Qrcode.propTypes = {};

export default Qrcode;
