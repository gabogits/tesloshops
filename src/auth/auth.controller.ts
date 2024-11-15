import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto} from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, GetRawHeaders, Auth } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';




@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers:IncomingHttpHeaders,
  ) {


  
    return {
      ok:true,
      message:'PRIVATE',
      user,
      userEmail,
      rawHeaders,
      headers
    }


  }


  @Get('private2')
  //@SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard) //UserRoleGuard en los personalozados no se usa la instancia no lleva los ()
  PrivateRoute2(
    @GetUser() user: User,
  ) {  
    return {
      ok:true,
      user,
    }
  }
  @Get('private3')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  PrivateRoute3(
    @GetUser() user: User,
  ) {  
    return {
      ok:true,
      user,
    }
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ) 
  {  
    return this.authService.checkAuthStatus(user)
  }
  

  /*

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return this.authService.update(+id, createUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
    */
}
