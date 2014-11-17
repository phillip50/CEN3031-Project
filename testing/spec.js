
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
	browser.get('http://localhost:3000/#!/insects');
	browser.driver.sleep(2000);

    element(by.css('.col-md-4:nth-of-type(1) .thumbnail a.btn')).click();

    //element(by.css('ul[value=0]')).click();

    //var todoList = element.all(by.repeater('todo in todos'));
    //expect(todoList.count()).toEqual(3);
    //expect(todoList.get(2).getText()).toEqual('write a protractor test');
  });
});
