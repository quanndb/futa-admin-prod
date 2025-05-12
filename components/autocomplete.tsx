import { AutocompleteOption } from "@/types/common";
import { useMemo } from "react";
import { GroupBase, StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";

// Define props interface
interface AutoCompleteProps {
  value?: AutocompleteOption | null;
  onChangeValue?: (selectedOption: AutocompleteOption | null) => void;
  loadOptions: (
    inputValue: string,
    callback: (options: AutocompleteOption[]) => void
  ) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
}

export default function AutoComplete({
  value,
  onChangeValue,
  loadOptions,
  placeholder,
  className = "",
  isDisabled = false,
}: AutoCompleteProps) {
  // Handle change event
  const handleChange = (newValue: AutocompleteOption | null) => {
    if (onChangeValue) {
      return onChangeValue(newValue);
    }
  };

  // Create a debounced loadOptions function using useMemo
  const debouncedLoadOptions = useMemo(() => {
    // We'll store the timeout ID here
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Return a function with the same signature as loadOptions
    return function (
      inputValue: string,
      callback: (options: AutocompleteOption[]) => void
    ) {
      // Handle empty input immediately
      if (!inputValue || inputValue.trim() === "") {
        callback([]);
        return;
      }

      // Clear previous timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout
      timeoutId = setTimeout(() => {
        loadOptions(inputValue, callback);
      }, 300); // 300ms debounce delay
    };
  }, [loadOptions]); // Only re-create when loadOptions changes

  return (
    <AsyncSelect<AutocompleteOption, false, GroupBase<AutocompleteOption>>
      value={value}
      cacheOptions
      defaultOptions
      onChange={handleChange}
      isClearable
      isDisabled={isDisabled}
      loadOptions={debouncedLoadOptions}
      styles={customStyles({ isDisabled })}
      placeholder={placeholder || "Lựa chọn..."}
      noOptionsMessage={() => "Không có kết quả"}
      loadingMessage={() => "Đang tìm kiếm"}
      classNamePrefix="autocomplete"
      className={className}
      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
      menuPosition="fixed"
    />
  );
}

// Custom styles for the AsyncSelect component
const customStyles = ({
  isDisabled,
}: {
  isDisabled: boolean;
}): StylesConfig<AutocompleteOption, false> => ({
  container: (provided) => ({
    ...provided,
    zIndex: 9999,
    position: "relative",
  }),
  control: (provided, state) => ({
    ...provided,
    minHeight: "44px",
    backgroundColor: isDisabled ? "#f9fafb" : "white",
    borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
    borderRadius: "0.375rem",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
    },
    transition: "all 0.2s ease",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    marginTop: "4px",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 15000,
    pointerEvents: "auto",
  }),
  option: (provided, state) => ({
    ...provided,
    zIndex: 9999,
    padding: "10px 16px",
    backgroundColor: state.isSelected
      ? "#eef2ff"
      : state.isFocused
      ? "#f9fafb"
      : "white",
    color: state.isSelected ? "#4f46e5" : "#1f2937",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#eef2ff",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "2px 12px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "44px",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#6366f1" : "#9ca3af",
    "&:hover": {
      color: state.isFocused ? "#4f46e5" : "#6b7280",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#9ca3af",
    pointerEvents: "auto",
    "&:hover": {
      color: "#6b7280",
    },
  }),
  loadingIndicator: (provided) => ({
    ...provided,
    color: "#6366f1",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "#6b7280",
  }),
});
