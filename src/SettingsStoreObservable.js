import { observable, action, computed } from "mobx";

class SettingsStoreObservable {
  @observable g_repeat_time = 1;
//   @action
//   removeItem(item) {
//     this.list = this.list.filter(l => {
//       return l !== item;
//     });
//   }
//   @action
//   addItem(item) {
//     this.list.push(item);
//   }
//   @computed
//   get listCount() {
//     return this.list.length;
//   }
}

export default new SettingsStoreObservable();
