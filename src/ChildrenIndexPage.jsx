import { useLoaderData, useNavigate } from "react-router-dom";

import { ChildrenIndex } from "./components/ChildrenIndex";

export function ChildrenIndexPage() {
  const children = useLoaderData();
  const navigate = useNavigate();

  const handleShow = (child) => {
    console.log("handleShow", child);
    navigate(`/children/${child.id}`);
  };

  return (
    <div>
      <ChildrenIndex children={children} onShow={handleShow} />
    </div>
  );
}