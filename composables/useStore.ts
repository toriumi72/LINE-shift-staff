import {
  doc,
  collection,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  FieldValue,
  Timestamp,
  serverTimestamp,
  writeBatch,
  SnapshotListenOptions,
  onSnapshot
} from "firebase/firestore"
import { cdate } from "cdate"

export const useStore = () => {

  //global
  const periodList = useState<any>('periodList', () => null)
  const userList = useState<any>('userList', () => null)

  const {
    collectionRef,
    docRef,
    getDocumentSnapshot,
    getQuerySnapShot,
    voidSetDoc,
    getAddDocRef,
    voidUpdateDoc,
    voidDeleteDoc,
  } = useFireStore()

  const { $fireStore } = useNuxtApp()
  const db = $fireStore as any

  const getUser = async (uid:string) => {
    const documentSnapshot = await getDocumentSnapshot(docRef("Users", uid)).catch((e: Error) => Promise.reject(e))
    return Promise.resolve(documentSnapshot.data())
  }

  const updateUser = async (uid:string, updateData:any) => {
    await voidUpdateDoc(docRef("Users", uid), updateData)
    return Promise.resolve()
  }

  const getUserListRealTime = async () => {
    const userListCollection = collection(db, "Users")
    const sortedUserListCollection = query(userListCollection)
    const onNext = (snapshot:any) => {
      userList.value = snapshot.docs.map((doc:any) => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log(userList.value)
    }
    const onError = (error:any) => {
      console.log("Error fetching data:", error)
    }

    const options: SnapshotListenOptions = { includeMetadataChanges: true }
    onSnapshot(sortedUserListCollection, options, onNext, onError)
  }


  const addPeriod = async (periodData:any) => { 
    const docId = periodData.startDate + '_' + periodData.endDate
    const documentData = {
      start: periodData.start,
      end: periodData.end,
      deadline: periodData.deadline,
      status: periodData.status,
      createdAt: serverTimestamp()
    }
    await voidSetDoc(docRef("Period", docId), documentData)
  }

  const getPeriodListRealTime = async () => {
    const periodListCollection = collection(db, "Period")
    const sortedPeriodListCollection = query(periodListCollection, orderBy("start", "desc"))
    const onNext = (snapshot:any) => {
      periodList.value = snapshot.docs.map((doc:any) => ({
        id: doc.id,
        ...doc.data(),
      }))
    }
    const onError = (error:any) => {
      console.log("Error fetching data:", error)
    }
    const options: SnapshotListenOptions = { includeMetadataChanges: true }
    onSnapshot(sortedPeriodListCollection, options, onNext, onError)
  }
  
  const addSubmit = async (uid:string, periodDocId:any, submitDataArray: any) => {

    const batch = writeBatch(db)

    submitDataArray.forEach((data: any) => {
      const date = data.startCdate.format("YYYY-MM-DD")
      const documentId = date + '_' + uid 
      // const staffRef = doc(db, 'Staff', uid)

      const documentData = {
        date: data.date,
        checkMark: data.checkMark,
        start: {
          hour: data.start.hour,
          minute: data.start.minute,
        },
        end: {
          hour: data.end.hour,
          minute: data.end.minute,
        },
        member: {
          uid: uid,
          // ref: staffRef,
        },
        startCdateTimestamp: Timestamp.fromDate(new Date(data.startCdate)),
        endCdateTimestamp: Timestamp.fromDate(new Date(data.endCdate)),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      // const staffRef = doc(db, 'Staff', user.uid)
      // Submit サブコレクションの参照を取得
      const periodRef = doc(db, 'Period', periodDocId)
      const submitRef = collection(periodRef, 'Submit')

      // サブコレクションにドキュメントを追加
      batch.set(doc(submitRef, documentId), documentData)
    })
    await batch.commit()
    alert("シフト希望が提出されました。シフト希望は期間中何度でも提出できます。")
  }

  const getSubmit = async (uid: any, periodId: any, dayDataList: any) => {
    try {
      const periodRef = doc(db, "Period", periodId)
  
      // PeriodドキュメントからSubmitサブコレクションへの参照を取得
      const submitCollectionRef = collection(periodRef, "Submit")

      const existDayDataArray:any = []

      for (const dayData of dayDataList) {
        // ドキュメントIDを組み立てて特定の提出データを取得
        const date = dayData.cdate.format("YYYY-MM-DD")
        const documentId = date + '_' + uid
        const submitDocRef = doc(submitCollectionRef, documentId)
        const submitDocSnapshot = await getDoc(submitDocRef)

        const submitData = submitDocSnapshot.data()
        existDayDataArray.push(submitData)
      }
  
      return Promise.resolve(existDayDataArray)
    } catch (error) {
      console.error("Error fetching submissions:", error)
      return Promise.reject(error)
    }
  }
  

  const getSubmitList = async (periodId: any) => {
    const periodRef = doc(db, "Period", periodId)
    const submitCollectionRef = collection(periodRef, "Submit")
  
    const submitList:any = []
  
    try {
      const querySnapshot = await getDocs(submitCollectionRef)
      querySnapshot.forEach((doc) => {
        const submitData = doc.data()
        submitList.push({
          id: doc.id,
          ...submitData,
        })
      })
    } catch (error) {
      console.error("Error fetching submit list:", error)
      return Promise.reject(error)
    }
  
    return Promise.resolve(submitList)
  }



  return {
    periodList,
    userList,

    getUser,
    updateUser,
    getUserListRealTime,

    addPeriod,
    getPeriodListRealTime,

    addSubmit,
    getSubmit,
    getSubmitList,
    
  }
}