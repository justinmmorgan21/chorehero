import { useLoaderData, useNavigate } from "react-router-dom";

import { ChoresIndex } from "./components/ChoresIndex";

export function ChoresIndexPage() {
  const chores = useLoaderData();
  const navigate = useNavigate();

  const handleShow = (chore) => {
    console.log("handleShow", chore);
    navigate(`/chores/${chore.id}`);
  };

  return (
    <div>
      <ChoresIndex chores={chores} onShow={handleShow} />
    </div>
  );
}