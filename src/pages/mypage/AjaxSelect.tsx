import { IonSelect, IonSelectOption, useIonLoading } from '@ionic/react';
import $ from 'jquery';
import React, { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface AjaxSelectProps {
  value?: string;
  placeholder?: string;
  jsonUrl: string;
  onChange: (value: string) => void;
}

const AjaxSelect: React.FC<AjaxSelectProps> = ({ value, placeholder, jsonUrl, onChange }) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [present, dismiss] = useIonLoading();

  const loadOptions = () => {
    present({ message: 'Loading options...' });
    $.getJSON(`${jsonUrl}?ts=${Date.now()}`, (data: SelectOption[]) => {
      setOptions(data);
      dismiss();
    }).fail(() => dismiss());
  };

  return (
    <IonSelect
      value={value}
      placeholder={options.length ? placeholder : "Tap to load options"}
      onClick={loadOptions}
      onIonChange={(e) => onChange(e.detail.value)}
    >
      {options.map(option => (
        <IonSelectOption key={option.value} value={option.value}>
          {option.label}
        </IonSelectOption>
      ))}
    </IonSelect>
  );
};

export default AjaxSelect;
