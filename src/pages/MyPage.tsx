import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MyItemList from '../components/MyItemList'; // ← 追加
import UserTable from '../components/UserTable';
import { useAjaxLoader } from '../hooks/useAjaxLoader'; // カスタムフックをインポート
interface UserData {
  name: string;
  email: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface ItemEntry {
  label: string;
  value: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
  company: string;
}

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const MyPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<CalendarValue>(new Date());
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [items, setItems] = useState<ItemEntry[]>([]);
  const { safePresent, safeDismiss } = useAjaxLoader();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    $.getJSON('/assets/json/usersTable.json', (data: User[]) => {
      setUsers(data);
    }).fail(() => {
      console.error('Failed to load user list.');
    });
  }, []);


  // ユーザーデータ取得
  useEffect(() => {
    const loadUserData = async () => {
      await safePresent('Loading user data...');
      
      $.ajax({
        url: 'https://api.example.com/user',
        method: 'GET',
        timeout: 10000,
        success: function (data: UserData) {
          setUserData(data);
          safeDismiss(); // ✅ 正常終了時はここだけ
        },
        error: function () {
          // ✅ フォールバック先でも safeDismiss() を1回だけ、必ず finally で呼ぶようにする
          $.getJSON('/assets/json/defaultUserData.json', function (data: UserData) {
            setUserData(data);
            console.log('[Data] user data set');
          }).fail(function () {
            setError('Failed to load user data.');
            console.log('[Data] failed to load fallback json');
          }).always(function () {
            console.log('[Loader] calling safeDismiss from .always');
            safeDismiss();  // ✅ ここで確実に呼ばれているか
          });
        },
      });
    };
  
    loadUserData();
  }, []);
  
  useEffect(() => {
    $.getJSON('/assets/json/itemList.json', function (data: ItemEntry[]) {
      setItems(data);
      console.log('[Items Loaded]', data);
    }).fail(function () {
      console.error('Failed to load item list.');
    });
  }, []);

  // 日付変更
  const handleDateChange = (newDate: CalendarValue) => {
    setDate(newDate);
    setShowCalendar(false);
  };

  // 選択肢取得
  const handleLoadOptions = async () => {
    await safePresent('Loading options...');
    $.getJSON('/assets/json/options.json', function (data: SelectOption[]) {
      setOptions(data);
      safeDismiss();
    }).fail(function () {
      setError('Failed to load select options.');
      safeDismiss();
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{userData ? `Welcome, ${userData.name}` : 'Loading...'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: '16px' }}>
          {error ? (
            <p>{error}</p>
          ) : userData ? (
            <p>Email: {userData.email}</p>
          ) : (
            <p>Loading user data...</p>
          )}

        <div style={{ padding: '16px' }}>
          {/* ✅ JSONから取得したitemsを渡す */}
          <MyItemList items={items} />
        </div>
          {/* 日付選択 */}
          <div style={{ margin: '16px 0', position: 'relative' }}>
            <IonButton onClick={() => setShowCalendar(true)}>
              {date instanceof Date
                ? date.toLocaleDateString()
                : Array.isArray(date)
                ? `${date[0]?.toLocaleDateString()} - ${date[1]?.toLocaleDateString()}`
                : 'Select Date'}
            </IonButton>

            {showCalendar && (
              <div style={{
                position: 'absolute',
                zIndex: 999,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                padding: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                borderRadius: '8px',
              }}>
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                />
                <IonButton fill="clear" onClick={() => setShowCalendar(false)}>Close</IonButton>
              </div>
            )}
          </div>

          {/* 動的に選択肢を読み込み */}
          <IonSelect
            value={selectedOption}
            placeholder={options.length ? "Select an option" : "Click to load options"}
            onClick={handleLoadOptions}
            onIonChange={(e) => setSelectedOption(e.detail.value)}
          >
            {options.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </div>
        <div style={{ padding: '16px' }}>
          <UserTable users={users} />
        </div>

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
