import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonSelect,
  IonSelectOption,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Route } from 'react-router-dom';
import MyItemList from '../components/MyItemList'; // ← 追加
import UserTable from '../components/UserTable';
import { useAjaxLoader } from '../hooks/useAjaxLoader'; // カスタムフックをインポート
import { getAllRequestsFromIndexedDB, removeRequestsByIndexes, saveRequestToIndexedDB } from '../utils/indexedDB'; // ← 追加

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

  const handleResendRequests = async () => {
    await safePresent('再送信中...');
    try {
      const requests = await getAllRequestsFromIndexedDB();
  
      const successIndexes: number[] = [];
      const reqWithIndex = requests.map((req, idx) => ({ req, idx }));
  
      for (const { req, idx } of reqWithIndex) {
        if (req.type === 'userPost') {
          try {
            await $.ajax({
              url: 'https://api.example.com/users',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(req.data),
            });
            successIndexes.push(idx);
            console.log('[Resend] 成功:', req);
          } catch (err) {
            console.warn('[Resend] 失敗（保存継続）:', req);
          }
        }
      }
  
      // 成功した分だけIndexedDBから削除
      await removeRequestsByIndexes(successIndexes);
  
      alert(`再送信完了（成功：${successIndexes.length}件）`);
    } catch (err) {
      console.error('[Resend] 全体エラー:', err);
      alert('リクエスト再送信に失敗しました');
    } finally {
      await safeDismiss();
    }
  };
  


  const handleSubmitUsers = async () => {
    await safePresent('Sending user data...');
  
    $.ajax({
      url: 'https://api.example.com/users',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(users),
      timeout: 10000,
      success: () => {
        console.log('Data sent successfully');
        safeDismiss();
      },
      error: async () => {
        console.warn('POST failed, saving to IndexedDB...');
        await saveRequestToIndexedDB({ type: 'userPost', data: users });
        safeDismiss();
      }
    });
  };
  
  
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
  <IonTabs>
    <IonTabBar slot="top">
      <IonTabButton tab="userData" href="/userData">
        <IonLabel>ユーザーデータ</IonLabel>
      </IonTabButton>
      <IonTabButton tab="items" href="/items">
        <IonLabel>アイテムリスト</IonLabel>
      </IonTabButton>
      <IonTabButton tab="actions" href="/actions">
        <IonLabel>アクション</IonLabel>
      </IonTabButton>
    </IonTabBar>

    <IonRouterOutlet>
      <Route path="/userData" exact>
        <div style={{ padding: '16px' }}>
          {error ? (
            <p>{error}</p>
          ) : userData ? (
            <p>Email: {userData.email}</p>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </Route>
      <Route path="/items" exact>
        <div style={{ padding: '16px' }}>
          <MyItemList items={items} />
          <div style={{ margin: '16px 0', position: 'relative' }}>
            <IonButton onClick={() => setShowCalendar(true)}>
              {date instanceof Date
                ? date.toLocaleDateString()
                : Array.isArray(date)
                ? `${date[0]?.toLocaleDateString()} - ${date[1]?.toLocaleDateString()}`
                : 'Select Date'}
            </IonButton>

            {showCalendar && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 999,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  padding: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                }}
              >
                <Calendar onChange={handleDateChange} value={date} />
                <IonButton fill="clear" onClick={() => setShowCalendar(false)}>
                  Close
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </Route>
      <Route path="/actions" exact>
        <div style={{ padding: '16px' }}>
          <IonSelect
            value={selectedOption}
            placeholder={options.length ? 'Select an option' : 'Click to load options'}
            onClick={handleLoadOptions}
            onIonChange={(e) => setSelectedOption(e.detail.value)}
          >
            {options.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
          <UserTable users={users} />
          <IonButton expand="block" color="primary" onClick={handleSubmitUsers}>
            ユーザー情報を送信
          </IonButton>
          <IonButton expand="block" color="success" onClick={handleResendRequests}>
            保存されたリクエストを送信
          </IonButton>
        </div>
      </Route>
    </IonRouterOutlet>
  </IonTabs>
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
