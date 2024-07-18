import Backdrop from "@material-ui/core/Backdrop";
import BackdropStyles from "./Backdrop.module.css";
export default function SimpleBackdrop({ open, showBackdrop, children }) {
  return (
    <div className={BackdropStyles.backdropContainer}>
      <Backdrop open={open} onClick={() => showBackdrop(false)}>
        {children}
      </Backdrop>
    </div>
  );
}
