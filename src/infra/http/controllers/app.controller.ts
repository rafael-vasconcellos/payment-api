import { Controller, Get, Redirect } from '@nestjs/common';


@Controller()
export class AppController { 
  @Get()
  @Redirect('/api', 301)
  appGet() {}
  @Get('/api')
  apiGet(): string {
    return "{routes: [user, transaction]}";
  }
}
