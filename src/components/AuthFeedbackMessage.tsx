import React from "react";
import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons" ;
import ShouldRender from "./ShouldRender";

type Props = {
  message: string;
  icon?: boolean;
  type?: "error" | "success";
};

const AuthFeedbackMessage: React.FC<Props> = ({
  message,
  icon = true,
  type = "error",
}) => {
  const isError = type === "error";

  return (
    <ShouldRender if={message}>
      <div
        className={`flex w-full items-center gap-2 ${
          isError ? "bg-red-600" : "bg-green-500 dark:bg-green-600"
        } p-3 text-center text-white`}
      >
        <ShouldRender if={icon && isError}>
          <ExclamationTriangleIcon  className="text-white" />
        </ShouldRender>

        <ShouldRender if={icon && !isError}>
          <CheckCircledIcon  className="text-white" />
        </ShouldRender>

        <p>{message}</p>
      </div>
    </ShouldRender>
  );
};

export default AuthFeedbackMessage;