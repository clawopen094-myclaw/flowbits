import CreateVariableDialog from "./CreateVariableDialog";

export default function AccountIntegrations(){
    return (
      <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between py-3">
        <p className="text-start text-xl font-semibold">Linked Accounts</p>
        {/* <CreateVariableDialog triggerText="Add Global Variable" /> */}
      </div>
      <div className="flex flex-col gap-3">
        test account linked
      </div>
    </div>
    )
  }