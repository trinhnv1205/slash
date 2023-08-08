import { Button } from "@mui/joy";
import { useStorage } from "@plasmohq/storage/hook";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Shortcut } from "@/types/proto/api/v2/shortcut_service_pb";
import "../style.css";
import Icon from "./Icon";

const PullShortcutsButton = () => {
  const [domain] = useStorage("domain");
  const [accessToken] = useStorage("access_token");
  const [, setShortcuts] = useStorage("shortcuts");
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    if (domain && accessToken) {
      handlePullShortcuts(true);
    }
  }, [domain, accessToken]);

  const handlePullShortcuts = async (silence = false) => {
    try {
      setIsPulling(true);
      const { data } = await axios.get<Shortcut[]>(`${domain}/api/v1/shortcut`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setShortcuts(data);
      if (!silence) {
        toast.success("Shortcuts pulled");
      }
    } catch (error) {
      toast.error("Failed to pull shortcuts, error: " + error.message);
    }
    setIsPulling(false);
  };

  return (
    <Button loading={isPulling} color="neutral" variant="plain" size="sm" onClick={() => handlePullShortcuts()}>
      <Icon.RefreshCcw className="w-4 h-auto" />
    </Button>
  );
};

export default PullShortcutsButton;