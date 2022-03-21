import React, { useState } from 'react'
import axios from 'axios'

const App = () => {
    const [file, setFile] = useState(null)
    const [text, setText] = useState("")

    const UploadImage = async (e) => {
        if (!file && text === "") {
            alert("Wrong!")
            return;
        }
        const LOCALHOST = process.env.REACT_APP_LOCALHOST
        const formData = new FormData();
        formData.append('file', file);
        formData.append('text', text);

        try {
            const res = await axios.post(
                `${LOCALHOST}/upload`,
                formData
            );
            console.log(res);
        } catch (ex) {
            console.log(ex);
        }

    }

    const Encoder = async (e) => {
        const LOCALHOST = process.env.REACT_APP_LOCALHOST
        try {
            const res = await axios.get(
                `${LOCALHOST}/encoder`,
            );
            console.log(
                JSON.stringify(res));
        } catch (ex) {
            console.log(ex);
        }
    }

    const Decoder = async (e) => {
        const LOCALHOST = process.env.REACT_APP_LOCALHOST
        try {
            const res = await axios.get(
                `${LOCALHOST}/decoder`,
            );
            alert("Şifrelenen mesaj: "+
                JSON.stringify(res.data.mes));
        } catch (ex) {
            console.log(ex);
        }
    }

    return (
        <div>
            <input type="text" placeholder='Enter ur text' onChange={(e) => setText(e.target.value)} />
            <input type="file" name="file" id="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
            <button onClick={UploadImage}>Upload Image</button>
            <button onClick={Encoder}>Encoder</button>
            <button onClick={Decoder}>Decoder</button>
        </div>
    )
}

export default App