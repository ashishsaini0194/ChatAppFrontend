export const getSwipe = (updateLeft, updateRight, touchableElement) => {
  let touchstartX;
  let touchstartY;
  let touchendX;
  let touchendY;
  if (!touchableElement.current) return;
  touchableElement.current.addEventListener(
    "touchstart",
    function (event) {
      touchstartX = event.changedTouches[0].screenX;
      touchstartY = event.changedTouches[0].screenY;
    },
    false
  );

  touchableElement.current.addEventListener(
    "touchend",
    function (event) {
      touchendX = event.changedTouches[0].screenX;
      touchendY = event.changedTouches[0].screenY;
      handleGesture();
    },
    false
  );

  function handleGesture() {
    if (touchendX < touchstartX) {
      updateRight();
      //   return "left";
    }

    if (touchendX > touchstartX + 30) {
      updateLeft();
      //   return "right";
    }

    //   if (touchendY < touchstartY) {
    //     return "up";
    //   }

    //   if (touchendY > touchstartY) {
    //     return "down";
    //   }

    //   if (touchendY === touchstartY) {
    //     console.log("Tap");
    //   }
  }
};
