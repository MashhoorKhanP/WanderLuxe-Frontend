import React, { useEffect, useState, useRef } from "react";
import "./adultPicker.css";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdultChildren,
  setAdultChildrenOptions,
} from "../../../store/slices/userSlices/roomSlice";
import { RootState } from "../../../store/types";
import { setAlert } from "../../../store/slices/userSlices/userSlice";

export interface Options {
  adult: number;
  children: number;
}

const AdultChildrenPicker: React.FC = () => {
  const dispatch = useDispatch();
  const adultChildOptions: Options = useSelector(
    (state: RootState) => state.room.adultChildrenOptions
  );
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState<Options>({
    adult: adultChildOptions.adult ? adultChildOptions.adult : 1,
    children: adultChildOptions.children ? adultChildOptions.children : 0,
  });

    if(adultChildOptions.adult + adultChildOptions.children === 4){
      dispatch(setAlert({open:true, severity:'warning', message:'Max People capacity reached'}))
    }
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dispatch the action with the updated count
    dispatch(setAdultChildren(options.adult + options.children));
    dispatch(setAdultChildrenOptions(options));

    // Event listener for clicking outside the component
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpenOptions(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [options.adult, options.children, dispatch]);

  const handleOption = (name: keyof Options, operation: "i" | "d") => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
    }));
  };

  return (
    <Box
      ref={pickerRef}
      sx={{ width: "50%", display: "flex", alignItems: "center" }}
    >
      <div className="headerSearch">
        <div className="headerSearchItem">
          <i className="bi bi-person-standing headerIcon"></i>
          <span
            onClick={() => setOpenOptions(!openOptions)}
            className="headerSearchText"
          >
            {`${options.adult} adult • ${options.children} children`}
          </span>
          {openOptions && (
            <div className="options">
              <div className="optionItem">
                <span className="optionText">Adult</span>
                <div className="optionCounter">
                  <button
                    disabled={options.adult <= 1 }
                    className="optionCounterButton"
                    onClick={() => handleOption("adult", "d")}
                  >
                    -
                  </button>
                  <span className="optionCounterNumber">
                    {adultChildOptions.adult
                      ? adultChildOptions.adult
                      : options.adult}
                  </span>
                  <button
                    disabled={options.adult + options.children === 4}
                    className="optionCounterButton"
                    onClick={() => handleOption("adult", "i")}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="optionItem">
                <span className="optionText">Children</span>
                <div className="optionCounter">
                  <button
                    disabled={options.children <= 0}
                    className="optionCounterButton"
                    onClick={() => handleOption("children", "d")}
                  >
                    -
                  </button>
                  <span className="optionCounterNumber">
                    {adultChildOptions.children
                      ? adultChildOptions.children
                      : options.children}
                  </span>
                  <button
                    disabled={options.adult + options.children === 4}
                    className="optionCounterButton"
                    onClick={() => handleOption("children", "i")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
};

export default AdultChildrenPicker;
