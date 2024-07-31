import React from "react";

type SelectCompanyFormProps = {
  onSelect: (companyId: string) => Promise<void>;
  onCancel: () => void;
};

const SelectCompanyForm: React.FC<SelectCompanyFormProps> = ({ onSelect }) => {
  return <div>SelectCompanyForm</div>;
};

export default SelectCompanyForm;
