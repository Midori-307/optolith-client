import { remote } from "electron"
import { Just, Nothing } from "../../Data/Maybe"
import { getIsHeroSection } from "../Selectors/uilocationSelectors"
import { TabId } from "../Utilities/LocationUtils"
import { isDialogOpen } from "../Utilities/SubwindowsUtils"
import { ReduxAction } from "./Actions"
import { saveHero } from "./HerolistActions"
import { redo, undo } from "./HistoryActions"
import { requestClose } from "./IOActions"
import { setTab } from "./LocationActions"
import { openSettings } from "./SubwindowsActions"

export const undoAccelerator = (): ReduxAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (undo ())
  }
}

export const redoAccelerator = (): ReduxAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (redo ())
  }
}

export const saveHeroAccelerator: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    if (!isDialogOpen () && getIsHeroSection (getState ())) {
      await dispatch (saveHero (Nothing))
    }
  }

export const backAccelerator = (): ReduxAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (setTab (TabId.Herolist))
  }
}

export const openSettingsAccelerator = (): ReduxAction => dispatch => {
  if (!isDialogOpen ()) {
    dispatch (openSettings ())
  }
}

export const quitAccelerator: ReduxAction = dispatch => {
  dispatch (requestClose (Just (remote.app.quit)))
}
