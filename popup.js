import React from 'react';
import ReactDOM from 'react-dom';


class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      isCheckedAll: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
  }

  componentDidMount() {
    new Promise((resolve, reject) => chrome.tabs.query({
      windowId: chrome.windows.WINDOW_ID_CURRENT,
    }, tabs => resolve(tabs)))
      .then(tabs => {
        const result = tabs.map(tab => ({
          checked: false,
          id: tab.id,
          url: tab.url,
          title: tab.title,
        }));
        this.setState({tabs: result});
      })
  }

  handleCheckAll() {
    const newChecked = !this.state.isCheckedAll;
    const newTabs = this.state.tabs.map(tab => ({...tab, checked: newChecked}))
    this.setState({
      isCheckedAll: newChecked,
      tabs: newTabs,
    });
  }

  handleCheck(e) {
    const id = e.target.value;
    const newTabs = this.state.tabs.map(tab => {
      if (tab.id == id) {
        return {
          ...tab,
          checked: !tab.checked,
        };
      }
      return tab;
    });
    this.setState({
      tabs: newTabs,
      isCheckedAll: newTabs.every(t => t.checked)
    });
  }

  render() {
    return (
      <div>
        <Head handleCheckAll={this.handleCheckAll}
              isCheckedAll={this.state.isCheckedAll}
              checkedTabs={this.state.tabs.filter(tab => tab.checked)}
        />
        <table>
          <tbody>
            {this.state.tabs.map(tab => <Tab key={tab.id} tab={tab} handleCheck={ this.handleCheck } />)}
          </tbody>
        </table>
      </div>
    );
  }
}

function Head({handleCheckAll, isCheckedAll, checkedTabs}) {
  const copiedText = checkedTabs.length===0 ? '' : checkedTabs.map(tab => `- [${tab.title}](${tab.url})`)
        .reduce((a, b) => a + "\n" + b);
  const [showMessage, setShowMessage] = React.useState(false);
  const handleCopy = () => {
    if (!copiedText) return;

    navigator.clipboard.writeText(copiedText);
    setShowMessage(true);
    window.setTimeout(() => setShowMessage(false), 1500);
  }
  return (
    <div>
      <label id="all-check">
        <input type="checkbox" checked={isCheckedAll} onChange={handleCheckAll}/>
        toggle
      </label>
      <button id="copy" onClick={handleCopy}>MD copy</button>
      {showMessage && (<span>COPIED!!</span>)}
    </div>
  )
}

function Tab ({tab, handleCheck}) {
  return (
    <tr>
      <td className="row">
        <label>
          <div>
            <input
              type="checkbox"
              value={tab.id}
              onChange={handleCheck}
              checked={tab.checked}
            />
            {tab.title}
          </div>
        </label>
      </td>
    </tr>);
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)


