import {
    IonContent, IonFooter, IonHeader, IonItem, IonLabel,
    IonList, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import AjaxSelect from './AjaxSelect';
// MyPage.tsx
import { CalendarValue, UserData } from '../../types/common';

import PopupCalendar from './PopupCalendar';

const [date, setDate] = useState<CalendarValue>(new Date());


// Removed local declaration of UserData to avoid conflict with imported type

// Removed duplicate declaration of CalendarValue

const MyPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<CalendarValue>(new Date());
  // Define the SelectOption type if not already defined
  type SelectOption = {
    value: string;
    label: string;
  };
  
  const [options, setOptions] = useState<SelectOption[]>([]);
  
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    $.ajax({
      url: 'https://api.example.com/user',
      method: 'GET',
      success: (data: UserData) => setUserData(data),
      error: () => {
        $.getJSON('/assets/defaultUserData.json', (data: UserData) => {
          setUserData(data);
        }).fail(() => setError('Failed to load user data.'));
      }
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{userData ? `Welcome, ${userData.name}` : 'Loading...'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ padding: '16px' }}>
        {error && <p>{error}</p>}
        {userData && <p>Email: {userData.email}</p>}

        <IonList>
          <IonItem><IonLabel>Item 1</IonLabel></IonItem>
          <IonItem><IonLabel>Item 2</IonLabel></IonItem>
          <IonItem><IonLabel>Item 3</IonLabel></IonItem>
        </IonList>

        <div style={{ margin: '16px 0' }}>
          <PopupCalendar value={date} onChange={setDate} />
        </div>

        <AjaxSelect
          value={selectedOption}
          placeholder="Select an option"
          jsonUrl="/assets/options.json"
          onChange={setSelectedOption}
        />
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonTitle>{userData ? `Contact: ${userData.email}` : 'Loading...'}</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default MyPage;
