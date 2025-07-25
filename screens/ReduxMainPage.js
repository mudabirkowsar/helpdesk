import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import Header from './Redux/Header'
import Product from './Redux/Product'
import { ScrollView } from 'react-native-gesture-handler'

export default function ReduxMainPage() {
    const products = [
        {
            name: "iPhone 13",
            description: "Experience the next level of performance",
            price: 65000,
            color: "Black",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ0yf1r7MIKTVBX7Ub5uSzjiS5YKcRcKdWQQ&s"
        },
        {
            name: "OnePlus 11R",
            description: "Powerful performance with premium design",
            price: 45000,
            color: "Silver",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkj4OwTcbPG_x6nYrWA9uYcnp9edDS9lu_AA&s"
        },
        {
            name: "Google Pixel 7",
            description: "AI-powered photography and clean Android",
            price: 55000,
            color: "Obsidian",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA2g5Liohe8OeHgYThOZ4YP6xxclET0foHKQ&s"
        },
        {
            name: "Realme GT Neo",
            description: "Speed meets style with Realme GT Neo",
            price: 29000,
            color: "Blue",
            image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQUYQSCUshN6r1yzvnw_I39qlOVSaAxigeRoIyuaq_J7mSk2yrg3pCcHkYYYfjhsG6NJtEm380HlT4CvkgEecicx7dvHTnb"
        },
        {
            name: "Xiaomi 13 Pro",
            description: "Top specs with amazing camera capabilities",
            price: 68000,
            color: "Black",
            image: "https://m.media-amazon.com/images/I/61RvCwjI7dL._UF1000,1000_QL80_.jpg"
        },
        {
            name: "Motorola Edge 30",
            description: "Edge-to-edge display and smooth performance",
            price: 32000,
            color: "Grey",
            image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSyHr1mLS6sy2BAsVkoQQaeGVQIOIlUQj6cCZMpMZw7eBrtztbWMHQZFD3loeeEjveTmrsrUI9D8-7JSYI1A-BXEc3fRu2otQ"
        },
        {
            name: "Vivo V29",
            description: "Sleek design and smart camera features",
            price: 26000,
            color: "Pink",
            image: "https://m.media-amazon.com/images/I/71UCRQ9+CrL.jpg"
        },
        {
            name: "Oppo Reno8",
            description: "Capture perfect portraits with Reno8",
            price: 28000,
            color: "Mint",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8tMc0d1SPklvlbDnMe_FojKVVaJCOGII9yg&s"
        },
        {
            name: "Samsung Galaxy A54",
            description: "Midrange king with awesome AMOLED display",
            price: 36000,
            color: "Lime",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrsp0OQOjqxmMICoQmtZJfJ-GsVfA5my8USQ&s"
        },
        {
            name: "Infinix Zero 5G",
            description: "Affordable 5G powerhouse",
            price: 17000,
            color: "Orange",
            image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQLaofPfaMKz-H_imOxD2bde6UBWdkxvXvfpmKv2FA55VZtSsYdfoh-ZkDjexQR8PRlXX0xIxr3aQq20e1G5jgEV-MWZtNChYVLUrQ5WqvQ"
        },
        {
            name: "iQOO Z7",
            description: "High performance gaming phone",
            price: 23000,
            color: "Teal",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX9uTGm56ob3IjZRFGjwpF6OVPX4EdbvSulw&s"
        },
        {
            name: "Lava Agni 2",
            description: "Made in India 5G phone with style",
            price: 21000,
            color: "Green",
            image: "https://www.lavamobiles.com/smartphones/agni-2/images/video-backup-img-2.jpg"
        },
        {
            name: "Nokia G42",
            description: "Durable phone with decent specs",
            price: 15000,
            color: "Purple",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtadJYfGQYhQ0BpOqOl-stGWQsX1eGxQ29_g&s"
        },
        {
            name: "Tecno Camon 20",
            description: "Affordable phone with amazing battery life",
            price: 12000,
            color: "Blue",
            image: "https://m.media-amazon.com/images/I/71F5hbrxUoL.jpg"
        },
        {
            name: "Nothing Phone 2",
            description: "Minimal design and powerful specs",
            price: 59000,
            color: "Transparent White",
            image: "https://m.media-amazon.com/images/I/810CVfjgGIL.jpg"
        },
        {
            name: "Asus ROG Phone 7",
            description: "Ultimate phone for pro gamers",
            price: 72000,
            color: "Storm White",
            image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ_bAgscMX0u-uJfLfthP_uVNmkQEoAA0fMRKE6XubsWLJE-s_ur7KaVUyi_MhiAJ8TsDjXNqVKSr86iL_c8b5V7ioUXoMHYxx9P1GBmWhXcJlsy9P2tzh5dA"
        },
        {
            name: "Sony Xperia 5 IV",
            description: "Cinematic video and crystal-clear audio",
            price: 78000,
            color: "Matte Black",
            image: "https://m.media-amazon.com/images/I/61pcxk9NXoL.jpg"
        },
        {
            name: "Honor 90",
            description: "Reborn with style and AI camera",
            price: 33000,
            color: "Emerald Green",
            image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTW-zocb5SuOlFSsAz_pJGRw1uPawPlZ4bQCd7fK3sg24Tjnk2nh7MgXUafvEj2wXQatden8XFCPtUsQO9aG7hou-_B73az3Ibgv0mW17f2D90NbA9nzWixlA"
        },
        {
            name: "Micromax In Note 2",
            description: "Budget phone with punchy display",
            price: 11000,
            color: "Jet Black",
            image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRhcik7OmgDOWR3NGnBJpLJPtXZ87-ltmpl-hEPCeCMuiE91pey7DN8DxLMQmPMex3ziCqY6AvT3QsQox_GrLRgXF4_y89oHOvgQawognSufVHGycij6fc-"
        },
        {
            name: "Poco X6 Pro",
            description: "Flagship performance in budget",
            price: 25000,
            color: "Yellow",
            image: "https://i02.appmifile.com/181_operatorx_operatorx_xm/08/01/2024/8eeed46fdb1339678c0fbf6b07245413.jpg"
        }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {
                    products.map((item, index) => (
                        <Product key={index} item={item} />
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 10, // 👈 prevents collapsing with bottom
        paddingHorizontal: 10
    }
})