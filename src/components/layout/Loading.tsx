import React from "react";
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    return (
        <div className="contentWrap">
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <HashLoader
                    color="#0047bb"
                    loading
                    size={88}
                />
            </div>
        </div>
    );
}

export default Loading;