import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example: "c7e93b98-317a-4093-b1f3-4eca2c15b582",
        description: "Product Id",
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

 
    @ApiProperty({
        example: "Tshirt",
        description: "Product title",
        uniqueItems:true
    })
    @Column('text', {
        unique:true,
    })
    title:string;

    @ApiProperty({
        example:500,
        description: "Product price",
        uniqueItems:true
    })
    @Column('float',
        {
            default:0,
        }
    )
    price:number;

    @ApiProperty({
        example:"algo de texto",
        description: "Product description",
        default:null,
     
    })
    @Column(  //esta sintaxis es diferente pero funciona igual que lo demás
        {   type:'text',
            nullable:true
        }
    )
    description:string;

    @ApiProperty({
        example:"shirtsgabriel_chida_2",
        description: "Product slug for seo rout",
        uniqueItems:true
    })
    @Column('text',
        {
            unique:true
        }
    )
    slug:string;

    @ApiProperty({
        example: 10,
        description: "Product stock",
        default:0,
    })
    @Column('int',
        {
            default:0,
        }
    )
    stock:number;
    
    @ApiProperty({
        example: [
            "SM",
            "M",
            "L"
        ],
        description: "Product size",

    })
    @Column('text',
        {
            array: true
        }
    )
    sizes:string[];

    @ApiProperty({
        example: 'women',
        description: "Product gender",

    })
    @Column('text')
    gender:string;


    @ApiProperty()
    @Column('text', {
        array:true,
        default:[]
    })
    tags:string[];

    @OneToMany(
        ()=> ProductImage,
        (productImage) => productImage.product,
        {cascade:true, eager:true}
    )
    images?:ProductImage[];

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user:User

    @BeforeInsert() 
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        }
        
        this.slug =  this.slug.toLowerCase().replaceAll(" ", "_").replaceAll("'", "")
    }
    @BeforeUpdate() 
    checkSlugUpdate(){
            this.slug =  this.slug.toLowerCase().replaceAll(" ", "_").replaceAll("'", "")
    }
    //@BeforeUpdate() 
}
