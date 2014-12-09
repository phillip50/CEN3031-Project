
describe('bugs homepage', function() {
  it('should click', function() {
  	browser.get('http://localhost:3000/#!/');
	browser.driver.sleep(2000);
	//browser.wait(element(by.id("profile")).isPresent);
	element(by.id('signin')).click();
	element(by.id('username')).sendKeys('test');
	element(by.id('password')).sendKeys('testtest');

	browser.driver.sleep(2000);
	element(by.id('signin')).click();
	browser.driver.sleep(2000);
	browser.get('http://localhost:3000/#!/notes/create');
	element(by.name('title')).sendKeys('testtest');
	//element(by.id('mce_87').sendKeys('test');

	browser.driver.sleep(2000);

    element(by.id('submit')).click();
	browser.driver.sleep(2000);

	browser.get('http://localhost:3000/#!/notes/');
	browser.driver.sleep(2000);
	browser.get('http://localhost:3000/#!/groups/create');
	browser.driver.sleep(2000);

	element(by.id('name')).sendKeys('cop4600');
	element(by.id('description')).sendKeys('This is really operating systems, but for the sake of the test, roll with it.');
    element(by.id('dropDown')).click();
    element(by.id('op1')).click();

	//element(by.id('selectoor')).sendKeys('BKN01');
	browser.driver.sleep(2000);

	element(by.id('submitButton')).click();
	browser.driver.sleep(2000);
	browser.get('http://localhost:3000/#!/groups/');
	browser.driver.sleep(2000);

    //element(by.css('ul[value=0]')).click();

    //var todoList = element.all(by.repeater('todo in todos'));
    //expect(todoList.count()).toEqual(3);
    //expect(todoList.get(2).getText()).toEqual('write a protractor test');
  });
});
