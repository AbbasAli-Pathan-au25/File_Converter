import React, { Fragment, useState } from "react";

import axios from "axios";
import FileDownload from "js-file-download";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const download = async () => {
    const res = await axios.get("download").then((data1) => {
      FileDownload(JSON.stringify(data1.data), "output.json");
    });
  };

  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
        <button className="btn btn-primary btn-block mt-4" onClick={download}>
          Download
        </button>
      </form>
    </Fragment>
  );
};

export default FileUpload;
