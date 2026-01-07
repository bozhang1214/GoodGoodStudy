import UIAbility from '@ohos.app.ability.UIAbility';
import window from '@ohos.window';
import { setContext } from '../utils/ContextUtil';

/**
 * 应用入口Ability
 */
export default class EntryAbility extends UIAbility {
  onCreate(want, launchParam) {
    console.info('[EntryAbility] onCreate');
    setContext(this.context);
  }

  onDestroy() {
    console.info('[EntryAbility] onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    console.info('[EntryAbility] onWindowStageCreate');
    windowStage.loadContent('pages/LoginPage', (err, data) => {
      if (err.code) {
        console.error(`[EntryAbility] Failed to load the content. Code: ${err.code}, message: ${err.message}`);
        return;
      }
      console.info('[EntryAbility] Succeeded in loading the content. Data: ' + JSON.stringify(data));
    });
  }

  onWindowStageDestroy() {
    console.info('[EntryAbility] onWindowStageDestroy');
  }

  onForeground() {
    console.info('[EntryAbility] onForeground');
  }

  onBackground() {
    console.info('[EntryAbility] onBackground');
  }
}
