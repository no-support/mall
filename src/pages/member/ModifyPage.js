import ModifyComponent from "../../components/member/ModifyComponent";
import BasicLayout from "../../layouts/BasicLayout";

const ModifyPage = () => {
  return (
    <BasicLayout>
      <div className="text-3xl">Member Modify Page</div>
      <div className="bg-white w-full mt-4 p-2">
        <ModifyComponent />
      </div>
    </BasicLayout>
  );
};

export default ModifyPage;
