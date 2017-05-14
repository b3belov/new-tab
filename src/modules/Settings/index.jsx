import './settings.less'

import classNames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as searchEngineActions from '../../actions/search-engines'
import * as settingsPageActions from '../../actions/settings-page'
import * as settingsActions from '../../actions/settings'

import muiThemeable from 'material-ui/styles/muiThemeable'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import HardwareMemory from 'material-ui/svg-icons/hardware/memory'
import ContentLink from 'material-ui/svg-icons/content/link'
import ActionSearch from 'material-ui/svg-icons/action/search'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import BookmarkBorder from 'material-ui/svg-icons/action/bookmark-border'
import LightbulbOutline from 'material-ui/svg-icons/action/lightbulb-outline'
import TextFormat from 'material-ui/svg-icons/content/text-format'
import CallSplit from 'material-ui/svg-icons/communication/call-split'
import ImageBrightness from 'material-ui/svg-icons/image/brightness-2'
import CloudQueue from 'material-ui/svg-icons/file/cloud-queue'
import FileDownload from 'material-ui/svg-icons/file/file-download'
import FileUpload from 'material-ui/svg-icons/file/file-upload'
import SettingsRestore from 'material-ui/svg-icons/action/settings-backup-restore'
import ActionInfo from 'material-ui/svg-icons/action/info-outline'
import HardwareKeyboard from 'material-ui/svg-icons/hardware/keyboard'
import FileCloud from 'material-ui/svg-icons/file/cloud'
import SocialMood from 'material-ui/svg-icons/social/mood'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import { List, ListItem } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'
import SvgIcon from 'material-ui/SvgIcon'

const FahrenheitIcon = props => {
  return (
    <SvgIcon {...props}>
      <path d="M11,20V5H20V8H14V11H19V14H14V20H11M6,3A3,3 0 0,1 9,6A3,3 0 0,1 6,9A3,3 0 0,1 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5Z" />
    </SvgIcon>
  )
}

import { version } from '../../configs'

import Donate from './Donate'
import Feedback from './Feedback'
import Theme from './Theme'
import Engines from './Engines'

const style = {
  toggleLabel: {
    fontSize: '15px'
  },
  toggleIcon: {
    marginRight: '30px',
    marginLeft: '4px'
  },
  listIcon: {
    marginLeft: 0
  },
  dialogContent: {
    width: 380
  },
  smallIcon: {
    width: 32,
    height: 32
  },
  small: {
    width: 64,
    height: 64,
    padding: 12,
  },
  fileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
  },
  snackbar: {
    maxWidth: '150px'
  }
}

class Settings extends Component {
  static propTypes = {
    status: PropTypes.bool.isRequired,
    hideSettings: PropTypes.func.isRequired,
    saveSettings: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }
  static contextTypes = {
    intl: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      display: 'none',
      resetOpen: false,
      snackbarOpen: false,
      snackbarMessage: ''
    }
  }
  componentWillReceiveProps(next) {
    // show or hide the settings page
    if (next.status) {
      this.setState({
        display: 'block'
      })
    } else {
      setTimeout(() => {
        this.setState({
          display: 'none'
        })
      }, 200)
    }
  }
  toggleLinkTarget = (event, bool) => {
    const { saveSettings, setLinkTarget } = this.props
    saveSettings('linkTarget', bool)
    setLinkTarget(bool)
  }
  toggleSearchTarget = (event, bool) => {
    const { saveSettings, setSearchTarget } = this.props
    saveSettings('searchTarget', bool)
    setSearchTarget(bool)
  }
  toggleHideAppsName = (event, bool) => {
    const { saveSettings, hideAppsName } = this.props
    saveSettings('hideAppsName', bool)
    hideAppsName(bool)
  }
  toggleRememberBookmarksState = (event, bool) => {
    const { saveSettings, rememberBookmarksState } = this.props
    saveSettings('rememberBookmarksState', bool)
    rememberBookmarksState(bool)
  }
  toggleSearchPredict = (event, bool) => {
    const { saveSettings, searchPredict } = this.props
    saveSettings('searchPredict', bool)
    searchPredict(bool)
  }
  toggleUseHK = (event, bool) => {
    const { saveSettings, useHK } = this.props
    saveSettings('useHK', bool)
    useHK(bool)
  }
  toggleFahrenheit = (event, bool) => {
    const { saveSettings, useFahrenheit } = this.props
    saveSettings('useFahrenheit', bool)
    useFahrenheit(bool)
  }
  toggleDarkMode = (event, bool) => {
    const { saveSettings, darkMode } = this.props
    saveSettings('darkMode', bool)
    darkMode(bool)
  }
  createBackups = async () => {
    const sync = await new Promise((resolve, reject) => {
      chrome.storage.sync.get(['websites', 'classified', 'engines'], result => {
        const arr = []
        const { websites, classified, engines } = result
        if (!Array.isArray(websites)) {
          resolve([[], [{ name: 'unclassified', set: [] }], engines])
        } else {
          resolve([websites, classified, engines])
        }
      })
    })
    try {
      let settings
      if (window.localStorage.settings) {
        settings = JSON.parse(window.localStorage.settings)
      }

      const data = JSON.stringify({
        settings: settings ? settings : {},
        websites: sync[0],
        classified: sync[1],
        engines: sync[2]
      })
      const backups = new Blob([data], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(backups)
      a.download = 'backups.json'
      a.click()
    } catch (error) {
      // console.log(error)
    }
  }
  restoreBackups = (e) => {
    const file = e.target.files[0]
    const fr = new FileReader()
    const { intl } = this.context
    fr.onloadend = e => {
      const { settings, websites, classified, engines } = JSON.parse(e.target.result)
      if (!classified) {
        this.setState({
          snackbarOpen: true,
          snackbarMessage: intl.formatMessage({ id: 'settings.br.restore.not.supported' })
        })
        return
      }

      window.localStorage.setItem('settings', JSON.stringify(settings))
      chrome.storage.sync.set({ websites, classified, engines })

      this.setState({
        snackbarOpen: true,
        snackbarMessage: intl.formatMessage({ id: 'settings.br.restore.message' })
      })
    }
    fr.readAsText(file)
  }
  openReset = () => {
    this.setState({
      resetOpen: true
    })
  }
  hideReset = () => {
    this.setState({
      resetOpen: false
    })
  }
  resetSettings = () => {
    window.localStorage.removeItem('settings')
    const { intl } = this.context
    this.setState({
      snackbarOpen: true,
      snackbarMessage: intl.formatMessage({ id: 'settings.br.reset.message' })
    })
    this.hideReset()
  }
  closeSnackerbar = () => {
    this.setState({
      snackbarOpen: false
    })
  }
  render() {
    const { status, data, hideSettings, changeTheme, muiTheme } = this.props
    const { display, currentTheme, snackbarOpen, snackbarMessage } = this.state
    const { intl } = this.context
    const resetActions = [
      <FlatButton
        label={intl.formatMessage({ id: 'button.cancel' })}
        primary={true}
        onTouchTap={this.hideReset}
      />,
      <FlatButton
        label={intl.formatMessage({ id: 'button.confirm' })}
        primary={true}
        onTouchTap={this.resetSettings}
      />
    ]
    return (
      <div className={classNames('settings-page', { 'show-settings-page': status, 'hide-settings-page': !status })}
        style={{ display }}
      >
        <Paper className="header-bar settings-header-bar" style={{ backgroundColor: muiTheme.palette.primary1Color }} rounded={false} zDepth={1}>
          <div className="tool-bar">
            <div className="bar-left">
              <IconButton onTouchTap={hideSettings}>
                <ArrowBack color={muiTheme.palette.alternateTextColor} />
              </IconButton>
              <div className="bar-label" style={{ color: muiTheme.palette.alternateTextColor }}>{intl.formatMessage({ id: 'settings.toolbar.title' })}</div>
            </div>
          </div>
        </Paper>
        <section style={{ backgroundColor: muiTheme.palette.settingsBackgroundColor }}>
          <div className="settings-section">
            <Paper className="settings-content" style={{ paddingLeft: 28, paddingRight: 28 }} zDepth={1}>
              <div className="toggle-box">
                <ContentLink style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.website.open.label' })}
                    defaultToggled={data.linkTarget}
                    onToggle={this.toggleLinkTarget}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              <div className="toggle-box">
                <TextFormat style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.apps.display.label' })}
                    defaultToggled={data.hideAppsName}
                    onToggle={this.toggleHideAppsName}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              <div className="toggle-box">
                <FahrenheitIcon style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.weather.fahrenheit.label' })}
                    defaultToggled={data.useFahrenheit}
                    onToggle={this.toggleFahrenheit}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              <div className="toggle-box">
                <BookmarkBorder style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.bookmarks.position.label' })}
                    defaultToggled={data.rememberBookmarksState}
                    onToggle={this.toggleRememberBookmarksState}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              {/*search*/}
              <h2 className="settings-title" style={{ color: muiTheme.palette.secondaryTextColor }}>{intl.formatMessage({ id: 'settings.search.title' })}</h2>
              <Engines />
              {/*<div className="toggle-box">
                <HardwareMemory style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.engine.save.label' })}
                    defaultToggled={data.autoSaveEngine}
                    onToggle={this.toggleAutoSaveEngine}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>*/}
              <div className="toggle-box">
                <ActionSearch style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.engine.search.label' })}
                    defaultToggled={data.searchTarget}
                    onToggle={this.toggleSearchTarget}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              <div className="toggle-box">
                <LightbulbOutline style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.search.predict.label' })}
                    defaultToggled={data.searchPredict}
                    onToggle={this.toggleSearchPredict}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              {/*仅对中文用户展示*/}
              {navigator.language === 'zh-CN' &&
                <div className="toggle-box">
                  <CallSplit style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                  <div className="toggle-wrapper">
                    <Toggle
                      className="toggle"
                      label="Google 搜索使用 .hk"
                      defaultToggled={data.useHK}
                      onToggle={this.toggleUseHK}
                      labelStyle={style.toggleLabel}
                    />
                  </div>
                </div>
              }
              {/*theme*/}
              <h2 className="settings-title" style={{ color: muiTheme.palette.secondaryTextColor }}>{intl.formatMessage({ id: 'settings.theme.title' })}</h2>
              <Theme
                changeTheme={changeTheme}
                toggleDarkMode={this.toggleDarkMode}
              />
              <div className="toggle-box">
                <ImageBrightness style={style.toggleIcon} color={muiTheme.palette.primary1Color} />
                <div className="toggle-wrapper">
                  <Toggle
                    className="toggle"
                    label={intl.formatMessage({ id: 'settings.theme.dark.label' })}
                    defaultToggled={data.darkMode}
                    onToggle={this.toggleDarkMode}
                    labelStyle={style.toggleLabel}
                  />
                </div>
              </div>
              {/*backup and restore*/}
              <h2 className="settings-title" style={{ color: muiTheme.palette.secondaryTextColor }}>{intl.formatMessage({ id: 'settings.br.title' })}</h2>
              <ListItem
                leftIcon={<FileUpload style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                primaryText={intl.formatMessage({ id: 'settings.br.backup.label' })}
                innerDivStyle={{ paddingLeft: '58px' }}
                onTouchTap={this.createBackups}
              />
              <ListItem
                leftIcon={<FileDownload style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                primaryText={intl.formatMessage({ id: 'settings.br.restore.label' })}
                innerDivStyle={{ paddingLeft: '58px' }}
              >
                <input type="file" style={style.fileInput} accept="application/json" onChange={this.restoreBackups} />
              </ListItem>
              <ListItem
                leftIcon={<SettingsRestore style={style.listIcon} color={muiTheme.palette.primary1Color} />}
                primaryText={intl.formatMessage({ id: 'settings.br.reset.label' })}
                innerDivStyle={{ paddingLeft: '58px' }}
                onTouchTap={this.openReset}
              />
            </Paper>
            <Dialog
              title={intl.formatMessage({ id: 'settings.reset.title' })}
              open={this.state.resetOpen}
              actions={resetActions}
              onRequestClose={this.hideReset}
              contentStyle={style.dialogContent}
            >
              {intl.formatMessage({ id: 'settings.reset.warning' })}
            </Dialog>
          </div>
          <div className="settings-section">
            <Paper className="settings-content about" zDepth={1}>
              <h3>{intl.formatMessage({ id: 'settings.about.title' })}</h3>
              <p className="name">Material Design New Tab <a href="https://tab.xiejie.co/logs" target="_blank"><FlatButton label={version} /></a></p>
              <div className="donate-feedback">
                <Donate />
                <Feedback />
              </div>
              {/*仅对中文用户展示*/}
              {navigator.language === 'zh-CN' &&
                <p className="tip">
                  <ActionInfo style={{ width: 18, height: 18 }} color="#999" />
                  <span>翻墙使用体验更佳</span>
                </p>
              }
              <div className="hot-key-box">
                <div className="tip">
                  <HardwareKeyboard style={{ width: 18, height: 18 }} color="#999" />
                  <span>{intl.formatMessage({ id: 'hotkey.title' })}</span>
                </div>
                <div className="hot-key-list">
                  <span className="hot-key-item">{intl.formatMessage({ id: 'hotkey.apps' })}</span>
                  <span className="hot-key">Alt + A</span>
                </div>
                <div className="hot-key-list">
                  <span className="hot-key-item">{intl.formatMessage({ id: 'hotkey.bookmarks' })}</span>
                  <span className="hot-key">Alt + B</span>
                </div>
                <div className="hot-key-list">
                  <span className="hot-key-item">{intl.formatMessage({ id: 'hotkey.settings' })}</span>
                  <span className="hot-key">Alt + S</span>
                </div>
              </div>
              <div className="tip">
                <FileCloud style={{ width: 18, height: 18 }} color="#999" />
                <span>{intl.formatMessage({ id: 'settings.about.weather.sources' })}: YAHOO! & HeWeather</span>
              </div>
              {navigator.language !== 'zh-CN' && (
                <div className="tip">
                  <SocialMood style={{ width: 18, height: 18 }} color="#999" />
                  <span>Forgive me for my poor English. You can also give me some advice on translation to add or improve the language you are using. Thank you.</span>
                </div>
              )}
              {/*<p className="intro">Please create an issue on <a href="https://github.com/ConanXie/react-koa-website/issues" target="_blank">Github</a> if you have any problems when using this extension. Thank you 😉</p>*/}
            </Paper>
          </div>
        </section>
        <Snackbar
          open={snackbarOpen}
          message={snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.closeSnackerbar}
          bodyStyle={style.snackbar}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { status } = state.settingsPage
  const { data } = state.settings
  return {
    status,
    data
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...settingsPageActions,
    ...settingsActions
  }, dispatch)
}

export default muiThemeable()(connect(mapStateToProps, mapDispatchToProps)(Settings))