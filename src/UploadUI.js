import React, { useState } from "react";

export default function UploadUI() {
  const [file, setFile] = useState("");
  const [resp, setResp] = useState({});

  function handleChange(event) {
    console.log(event.target.files);
    setResp({});
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile("");
    }
  }
  function launch_toast() {
    var x = document.getElementById("toast");
    x.className = "show";
    setTimeout(function () {
      x.className = x.className.replace("show", "");
    }, 5000);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let headersList = {
        authority: "api.audo.ai",
        accept: "*/*",
        "accept-language": "en-IN,en-GB;q=0.9,en;q=0.8,en-US;q=0.7",
        authorization: "Bearer undefined",
        origin: "https://app.audo.ai",
        referer: "https://app.audo.ai/",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "macOS",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.82",
        "x-requested-with": "XMLHttpRequest",
      };

      let bodyContent = new FormData();
      bodyContent.append("file", file);

      let response = await fetch("https://api.audo.ai/v1/demo/remove-noise", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.json();
      console.log("data", data.jobId);
      if (data?.jobId) {
        console.log(data);
        const socket = new WebSocket(
          `wss://api.audo.ai/v1/wss/demo/remove-noise/${data?.jobId}/status`
        );

        socket.onopen = () => {
          console.log("WebSocket connection established.");
        };

        socket.onmessage = (event) => {
          var jsonDaata = JSON.parse(event.data);
          console.log("Received WebSocket message:", jsonDaata);

          if (jsonDaata?.state === "in_progress") {
            setResp(jsonDaata);
          }
          if (jsonDaata?.state === "succeeded") {
            setResp(jsonDaata);
            launch_toast();
          }
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
          console.log("WebSocket connection closed.");
        };
      }
    } catch (error) {
      console.log("🚀 ~ file: UploadUI.js:80 ~ handleSubmit ~ error:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleChange} />
          {file !== "" ? (
            <p>{file?.name}</p>
          ) : (
            <p>Drag your files here or click in this area.</p>
          )}
        </div>

        <button type="submit">
          {resp?.percent ? `Uploading ${resp?.percent}%` : "Upload"}
        </button>
      </form>
      <div className="audioFiles">
        {resp.originalPreview && (
          <>
            <p className="heading">Original audio</p>
            <audio controls>
              <source src={resp.originalPreview} type="audio/ogg" />
            </audio>
          </>
        )}
        {resp.processedFull && (
          <>
            <p className="heading">Processed audio</p>
            <audio controls>
              <source src={resp.processedFull} type="audio/ogg" />
            </audio>
          </>
        )}
      </div>
      <div id="toast">
        <div id="img">Icon</div>
        <div id="desc">Audio Cleaned Successfully</div>
      </div>
    </div>
  );
}
