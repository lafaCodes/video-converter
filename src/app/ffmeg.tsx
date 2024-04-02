'use client'
import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import styles from "./page.module.css";

export default function Ffmpeg() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [outputFormat, setOutputFormat] = useState('gif'); // Default output format
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        // Load FFmpeg only once on component mount
        const loadFFmpeg = async () => {
            setIsLoading(true);
            setError(null); // Clear previous errors

            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
            const ffmpeg = ffmpegRef.current;
            ffmpeg.on('log', ({ message }) => {
                if (messageRef.current) messageRef.current.innerHTML = message;
            });

            try {
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
                setLoaded(true);
                setIsLoading(false);
            } catch (error) {
                setError(error); // Handle loading errors
                console.error('FFmpeg loading failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFFmpeg();
    }, []); // Empty dependency array to run only once

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0]); // Access the selected file
    };

    const handleOutputFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOutputFormat(event.target.value);
    };

    const convertVideo = async () => {
        if (!selectedFile) {
          setError('Please select a video file to convert.');
          return;
        }
    
        const ffmpeg = ffmpegRef.current;
        setIsLoading(true);
        setError(null); // Clear previous errors
    
        try {
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = async (e) => {
            const arrayBuffer = e.target.result as ArrayBuffer;
            await ffmpeg.writeFile('input.webm', arrayBuffer); // Assuming webm input (adjust if needed)
    
            // Set output format to GIF
            const outputFormat = 'gif';
    
            // Execute FFmpeg command for conversion
            await ffmpeg.exec(['-i', 'input.webm', `output.${outputFormat}`]);
    
            const data = await ffmpeg.readFile(`output.${outputFormat}`);
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(
              new Blob([data.buffer], { type: `image/gif` })
            );
            downloadLink.download = `output.${outputFormat}`; // Adjust filename
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
          };
          reader.onerror = (error) => {
            setError(`Error reading the selected file: ${error}`);
            console.error('Error reading file:', error);
            setIsLoading(false);
          };
        } catch (error) {
          setError(`Conversion failed: ${error}`);
          console.error('Conversion error:', error);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            {error && <p className="text-red-500">{error}</p>}

            {isLoading && <p>Loading FFmpeg...</p>}

            {!loaded && !isLoading && (
                <p>FFmpeg is not loaded yet.</p>
            )}

            {loaded && !isLoading && !error && (
                <>
                    <input type="file" id="file-input" onChange={handleFileChange} />
                    <label for="file-input">Choose a file</label>


                    <button id="convert-button" className={styles.button} onClick={convertVideo}>
                        Convert to {outputFormat}
                    </button>
                    <br />
                    <select value={outputFormat} onChange={handleOutputFormatChange}>
                        <option value="gif">GIF</option>
                        {/* Add options for other supported formats here */}
                    </select>
                </>
            )}

            {loaded && !isLoading && videoRef.current && (
                <video ref={videoRef} controls width="320" height="240" />
            )}
        </div>
    );
}