export const AudioController = async () => {
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
  return await navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
};
