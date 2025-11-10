import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock google.script.run to use localStorage, making it a standalone client-side app.
console.warn('Application is running in standalone mode using localStorage for data persistence.');
window.google = {
  script: {
    run: (function() {
      const createApiRunner = (successCallback = console.log, failureCallback = console.error) => {
        const runner = {
          withSuccessHandler: function(cb) { return createApiRunner(cb, failureCallback); },
          withFailureHandler: function(cb) { return createApiRunner(successCallback, cb); },
          getReleases: function() {
            setTimeout(() => {
              try {
                const releases = JSON.parse(localStorage.getItem('releases') || '[]');
                successCallback(releases);
              } catch (e) { failureCallback(e); }
            }, 300);
          },
          saveRelease: function(releaseData) {
            setTimeout(() => {
              try {
                let releases = JSON.parse(localStorage.getItem('releases') || '[]');
                let savedRelease;
                if (releaseData.id) {
                  savedRelease = { ...releaseData };
                  releases = releases.map(r => r.id === releaseData.id ? savedRelease : r);
                } else {
                  // Generate custom displayId
                  const now = new Date();
                  const currentMonth = now.getMonth() + 1;
                  const currentYear = now.getFullYear();

                  const releasesThisMonthAndYear = releases.filter(r => {
                      if (!r.data) return false;
                      const releaseDate = new Date(r.data + 'T00:00:00');
                      return releaseDate.getMonth() + 1 === currentMonth && releaseDate.getFullYear() === currentYear;
                  });

                  const lastSequence = releasesThisMonthAndYear.reduce((max, r) => {
                      if (r.displayId) {
                          const parts = r.displayId.split('.');
                          if (parts.length === 2) {
                              const sequence = parseInt(parts[1], 10);
                              if (!isNaN(sequence)) {
                                  return Math.max(max, sequence);
                              }
                          }
                      }
                      return max;
                  }, 0);
                  
                  const newSequence = lastSequence + 1;
                  const displayId = `${currentMonth}.${newSequence}`;
                  
                  savedRelease = { ...releaseData, id: Date.now(), displayId };
                  releases.unshift(savedRelease);
                }
                localStorage.setItem('releases', JSON.stringify(releases));
                successCallback(savedRelease);
              } catch (e) { failureCallback(e); }
            }, 300);
          },
          deleteRelease: function(id) {
            setTimeout(() => {
              try {
                let releases = JSON.parse(localStorage.getItem('releases') || '[]');
                releases = releases.filter(r => r.id !== id);
                localStorage.setItem('releases', JSON.stringify(releases));
                successCallback(null);
              } catch (e) { failureCallback(e); }
            }, 300);
          },
          getFiberStock: function() {
            setTimeout(() => {
              try {
                const stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                successCallback(stock);
              } catch (e) { failureCallback(e); }
            }, 300);
          },
          saveFiberStock: function(itemData) {
            setTimeout(() => {
              try {
                let stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                let savedItem;
                if (itemData.id) {
                  savedItem = { ...itemData };
                  stock = stock.map(s => s.id === itemData.id ? savedItem : s);
                } else {
                  const newId = Date.now();
                  const creationDate = new Date(newId);
                  const currentMonth = creationDate.getMonth() + 1;
                  const currentYear = creationDate.getFullYear();

                  const stockThisMonthAndYear = stock.filter(item => {
                      const itemDate = new Date(item.id);
                      return itemDate.getMonth() + 1 === currentMonth && itemDate.getFullYear() === currentYear;
                  });
                  
                  const lastSequence = stockThisMonthAndYear.reduce((max, item) => {
                      if (item.displayId) {
                          const parts = item.displayId.split('.');
                          if (parts.length === 2) {
                              const sequence = parseInt(parts[1], 10);
                              if (!isNaN(sequence)) {
                                  return Math.max(max, sequence);
                              }
                          }
                      }
                      return max;
                  }, 0);

                  const newSequence = lastSequence + 1;
                  const displayId = `${currentMonth}.${newSequence}`;
                  
                  savedItem = { ...itemData, id: newId, displayId };
                  stock.unshift(savedItem);
                }
                localStorage.setItem('fiberStock', JSON.stringify(stock));
                successCallback(savedItem);
              } catch (e) { failureCallback(e); }
            }, 300);
          },
          deleteFiberStock: function(id) {
            setTimeout(() => {
              try {
                let stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                stock = stock.filter(s => s.id !== id);
                localStorage.setItem('fiberStock', JSON.stringify(stock));
                successCallback(null);
              } catch (e) { failureCallback(e); }
            }, 300);
          },
          importFiberStock: function(items) {
            setTimeout(() => {
              try {
                let stock = JSON.parse(localStorage.getItem('fiberStock') || '[]');
                const newItems = items.map((item, index) => ({...item, id: Date.now() + index }));
                const updatedStock = [...newItems, ...stock];
                localStorage.setItem('fiberStock', JSON.stringify(updatedStock));
                successCallback(updatedStock);
              } catch(e) { failureCallback(e); }
            }, 500);
          },
          getAdminLists: function() {
            setTimeout(() => {
              try {
                let lists = JSON.parse(localStorage.getItem('adminLists'));
                if (!lists) {
                  lists = {
                    operadores: ['08 - LUIZ', '08 - FABIO', '05 - EDER', '04 - EVERTON', '03 - LUCAS', '03 - RAFAEL', '01 - ALTIERES'],
                    ruas: [
                      'SP - 01', 'SP - 02', 'SP - 03', 'SP - 04', 'SP - 05', 'SP - 06', 'SP - 07', 'SP - 08', 'SP - 09', 'SP - 10',
                      'SP - 11', 'SP - 12', 'SP - 13', 'SP - 14', 'SP - 15', 'SP - 16', 'SP - 17', 'SP - 18', 'SP - 19', 'SP - 20',
                      'SP - 21', 'SP - 22', 'SP - 23', 'SP - 24', 'SP - 25', 'SP - 26', 'SP - 27', 'SP - 28', 'SP - 29', 'SP - 30',
                      'SP - 31', 'SP - 32', 'TENDA', 'STEEL', 'MEZANINO',
                    ],
                    locaisDeEntrega: ['RAMPA', 'TENDA', 'KANBAN'],
                  };
                  localStorage.setItem('adminLists', JSON.stringify(lists));
                }
                successCallback(lists);
              } catch (e) { failureCallback(e); }
            }, 300);
          },
          saveAdminLists: function(lists) {
            setTimeout(() => {
              try {
                localStorage.setItem('adminLists', JSON.stringify(lists));
                successCallback(lists);
              } catch (e) { failureCallback(e); }
            }, 300);
          }
        };
        return new Proxy(runner, {
            get(target, prop) {
                if (prop in target) return target[prop];
                // Fix: Explicitly convert `prop` to a string to avoid a runtime error when `prop` is a symbol.
                console.warn(`google.script.run.${String(prop)} is not mocked.`);
                return () => target;
            }
        });
      };
      return createApiRunner();
    }())
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);