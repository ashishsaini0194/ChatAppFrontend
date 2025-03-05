export const AudioController = async (setError) => {
  const handleSuccess = (res) => {
    const options = { mimeType: "audio/webm" };
    const device = new MediaRecorder(res, options);
    document.mediaRecorder = device;
    return device;
  };
  //   const ifGranted = await navigator.permissions.query({ name: "microphone" });
  //   if (ifGranted.state === "granted") {
  //     return handleSuccess();
  //   }
  //   console.log("prem");
  try {
    return await navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
  } catch (e) {
    if (String(e).includes("Permission denied")) {
      setError("Mic Permission Denied");
    } else setError(String(e));
  }
};
