import {defer} from 'rxjs';
import {} from 'jasmine';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, e => { fail(e); done(); });
  };
}
