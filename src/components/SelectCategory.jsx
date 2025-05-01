import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const SelectCategory = ({ categories, label, onChange, selectedCategory = "0" }) => {
  const handleSelect = (value) => {
    onChange(Number(value));
  };

  const renderCategories = (categories, prefix = "") => {
    return categories.map((category) => {
      const displayName = `${prefix}${category.category_name}`;
      return (
        <React.Fragment key={category.category_id}>
          <SelectItem value={category.category_id.toString()}>
            {displayName}
          </SelectItem>
          {category.children &&
            renderCategories(category.children, `${displayName} > `)}
        </React.Fragment>
      );
    });
  };

  return (
    <Select onValueChange={handleSelect} value={selectedCategory}>
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"0"}>None</SelectItem>
        {renderCategories(categories)}
      </SelectContent>
    </Select>
  );
};

export default SelectCategory;
